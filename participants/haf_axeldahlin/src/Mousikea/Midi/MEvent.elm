module Mousikea.Midi.MEvent exposing
    ( Performance
    , DurT, MContext, MEvent, PTime, perform1, perform1Dur, performAbsPitch, performAbsPitchVol, performNote1, performPitch, performPitchVol
    )

{-| Event representation for notes. Used in conversion from Music to MIDI.

Many functions in Mousikea act on `Performance`, which is defined as:

@docs Performance

-}

import Mousikea.Music
    exposing
        ( AbsPitch
        , Articulation(..)
        , Control(..)
        , Dynamic(..)
        , InstrumentName(..)
        , Music(..)
        , Music1
        , Note1
        , NoteAttribute(..)
        , PhraseAttribute(..)
        , Pitch
        , StdLoudness(..)
        , Tempo(..)
        , Volume
        , absPitch
        , fromAbsPitch
        , fromAbsPitchVolume
        , fromNote1
        , fromPitch
        , fromPitchVolume
        , qn
        , scaleDurations
        , shiftPitches1
        , zero
        )
import Mousikea.Primitive exposing (Dur, Primitive(..))
import Mousikea.Util.Ratio as Ratio exposing (Rational)


type alias Performance =
    List MEvent


type alias PTime =
    Rational


type alias DurT =
    Rational


type alias MEvent =
    { eTime : PTime
    , eInst : InstrumentName
    , ePitch : AbsPitch
    , eDur : DurT
    , eVol : Volume
    , eParams : List Float
    }


type alias MContext =
    { mcTime : PTime
    , mcInst : InstrumentName
    , mcDur : DurT
    , mcVol : Volume
    }


merge : Performance -> Performance -> Performance
merge es1 es2 =
    case ( es1, es2 ) of
        ( [], es2_ ) ->
            es2_

        ( es1_, [] ) ->
            es1_

        ( h1 :: t1, h2 :: t2 ) ->
            if Ratio.lt h1.eTime h2.eTime then
                h1 :: merge t1 es2

            else
                h2 :: merge es1 t2


performPitch : Music Pitch -> Performance
performPitch =
    perform1 << fromPitch


performPitchVol : Music ( Pitch, Volume ) -> Performance
performPitchVol =
    perform1 << fromPitchVolume


performAbsPitch : Music AbsPitch -> Performance
performAbsPitch =
    perform1 << fromAbsPitch


performAbsPitchVol : Music ( AbsPitch, Volume ) -> Performance
performAbsPitchVol =
    perform1 << fromAbsPitchVolume


performNote1 : Music Note1 -> Performance
performNote1 =
    perform1 << fromNote1


perform1 : Music1 -> Performance
perform1 =
    Tuple.first << perform1Dur


perform1Dur : Music1 -> ( Performance, DurT )
perform1Dur =
    let
        -- timing musicToMEventss
        metro : Int -> Dur -> DurT
        metro setting dur =
            Ratio.divIntBy 60 (Ratio.mulByInt dur setting)

        defCon =
            { mcTime = Ratio.fromInt 0, mcInst = AcousticGrandPiano, mcDur = metro 120 qn, mcVol = 127 }
    in
    musicToMEvents defCon << applyControls


applyControls : Music1 -> Music1
applyControls m =
    case m of
        Modify (Tempo r) m_ ->
            scaleDurations r (applyControls m_)

        Modify (Transpose k) m_ ->
            shiftPitches1 k (applyControls m_)

        Modify x m_ ->
            Modify x (applyControls m_)

        Seq m1 m2 ->
            Seq (applyControls m1) (applyControls m2)

        Par m1 m2 ->
            Par (applyControls m1) (applyControls m2)

        x ->
            x


musicToMEvents : MContext -> Music1 -> ( Performance, DurT )
musicToMEvents ctx m =
    case m of
        Prim (Note dur p) ->
            ( [ noteToMEvent ctx dur p ], Ratio.mul dur ctx.mcDur )

        Prim (Rest dur) ->
            ( [], Ratio.mul dur ctx.mcDur )

        Seq m1 m2 ->
            let
                ( evs1, d1 ) =
                    musicToMEvents ctx m1

                ( evs2, d2 ) =
                    musicToMEvents { ctx | mcTime = Ratio.add ctx.mcTime d1 } m2
            in
            ( evs1 ++ evs2, Ratio.add d1 d2 )

        Par m1 m2 ->
            let
                ( evs1, d1 ) =
                    musicToMEvents ctx m1

                ( evs2, d2 ) =
                    musicToMEvents ctx m2
            in
            ( merge evs1 evs2, Ratio.max d1 d2 )

        Modify (Instrument i) m_ ->
            musicToMEvents { ctx | mcInst = i } m_

        Modify (Phrase pas) m_ ->
            phraseToMEvents ctx pas m_

        Modify (KeySig _ _) m_ ->
            -- KeySig causes no change
            musicToMEvents ctx m_

        Modify (Custom _) m_ ->
            -- Custom causes no change
            musicToMEvents ctx m_

        Modify _ m_ ->
            -- Transpose and Tempo addressed by applyControls
            musicToMEvents ctx (applyControls m_)


noteToMEvent : MContext -> Dur -> ( Pitch, List NoteAttribute ) -> MEvent
noteToMEvent ctx dur ( p, nas ) =
    let
        nasFun : NoteAttribute -> MEvent -> MEvent
        nasFun na ev =
            case na of
                Volume v ->
                    { ev | eVol = v }

                Params pms ->
                    { ev | eParams = pms }

                _ ->
                    ev

        e0 =
            { eTime = ctx.mcTime
            , ePitch = absPitch p
            , eInst = ctx.mcInst
            , eDur = Ratio.mul dur ctx.mcDur
            , eVol = ctx.mcVol
            , eParams = []
            }
    in
    List.foldr nasFun e0 nas


phraseToMEvents : MContext -> List PhraseAttribute -> Music1 -> ( Performance, DurT )
phraseToMEvents ctx pas m =
    case pas of
        [] ->
            musicToMEvents ctx m

        h :: t ->
            let
                ( pf, dur ) =
                    phraseToMEvents ctx t m

                loud x =
                    phraseToMEvents ctx (Dyn (Loudness (Ratio.fromInt x)) :: t) m

                stretch x =
                    let
                        t0 =
                            List.head pf |> Maybe.map .eTime |> Maybe.withDefault zero

                        r =
                            Ratio.div x dur

                        upd ev =
                            let
                                dt =
                                    Ratio.sub ev.eTime t0

                                t_ =
                                    Ratio.add
                                        (Ratio.mul
                                            (Ratio.add (Ratio.fromInt 1) (Ratio.mul dt r))
                                            dt
                                        )
                                        t0

                                d_ =
                                    Ratio.mul
                                        (Ratio.add
                                            (Ratio.fromInt 1)
                                            (Ratio.mul
                                                (Ratio.add
                                                    (Ratio.mul
                                                        (Ratio.fromInt 2)
                                                        dt
                                                    )
                                                    ev.eDur
                                                )
                                                r
                                            )
                                        )
                                        ev.eDur
                            in
                            { ev | eTime = t_, eDur = d_ }
                    in
                    ( List.map upd pf, Ratio.mul (Ratio.add (Ratio.fromInt 1) x) dur )

                inflate x =
                    let
                        t0 =
                            List.head pf |> Maybe.map .eTime |> Maybe.withDefault zero

                        r =
                            Ratio.div x dur

                        upd ev =
                            { ev
                                | eVol =
                                    Ratio.mul
                                        (Ratio.add
                                            (Ratio.fromInt 1)
                                            (Ratio.mul
                                                (Ratio.sub ev.eTime t0)
                                                r
                                            )
                                        )
                                        (Ratio.fromInt ev.eVol)
                                        |> Ratio.round
                            }
                    in
                    ( List.map upd pf, dur )
            in
            case h of
                Dyn (Accent x) ->
                    ( List.map (\e -> { e | eVol = Ratio.mul x (Ratio.fromInt e.eVol) |> Ratio.round }) pf, dur )

                Dyn (StdLoudness l) ->
                    case l of
                        PPP ->
                            loud 40

                        PP ->
                            loud 50

                        P ->
                            loud 60

                        MP ->
                            loud 70

                        SF ->
                            loud 80

                        MF ->
                            loud 90

                        NF ->
                            loud 100

                        FF ->
                            loud 110

                        FFF ->
                            loud 120

                Dyn (Loudness x) ->
                    phraseToMEvents { ctx | mcVol = Ratio.round x } t m

                Dyn (Crescendo x) ->
                    inflate x

                Dyn (Diminuendo x) ->
                    inflate (Ratio.mul (Ratio.fromInt -1) x)

                Tmp (Ritardando x) ->
                    stretch x

                Tmp (Accelerando x) ->
                    stretch (Ratio.mul (Ratio.fromInt -1) x)

                Art (Staccato x) ->
                    ( List.map (\e -> { e | eDur = Ratio.mul x e.eDur }) pf, dur )

                Art (Legato x) ->
                    ( List.map (\e -> { e | eDur = Ratio.mul x e.eDur }) pf, dur )

                Art (Slurred x) ->
                    let
                        lastStartTime =
                            List.foldr (\e acc -> Ratio.max e.eTime acc) zero pf

                        setDur e =
                            if Ratio.lt e.eTime lastStartTime then
                                { e | eDur = Ratio.mul x e.eDur }

                            else
                                e
                    in
                    ( List.map setDur pf, dur )

                Art _ ->
                    -- not supported
                    ( pf, dur )

                Orn _ ->
                    -- not supported
                    ( pf, dur )

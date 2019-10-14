module Mousikea.Generator exposing (blueBossa, bossa, randomness)

import List.Extra
import Mousikea.Music as Music exposing (..)
import Mousikea.PercussionSound exposing (PercussionSound(..))
import Mousikea.Primitive exposing (Dur, Primitive(..))
import Mousikea.Util.Ratio as Ratio
import Random


type alias Scale =
    List PitchClass


type alias LeadSheetPart =
    { duration : Dur
    , scale : Scale
    }


type alias MusicV =
    Music ( AbsPitch, Volume )


bossa : Random.Generator Music1
bossa =
    let
        cDorian =
            [ C, D, Ef, F, G, A, Bf ]

        product f xs ys =
            xs |> List.Extra.andThen (\x -> List.map (f x) ys)

        scales : List Scale
        scales =
            product
                (\root -> List.map (\pc -> pcToInt pc + root |> indexToPitchClass))
                (List.range 0 11)
                [ cDorian ]

        parts n =
            case scales of
                [] ->
                    Random.constant []

                x :: xs ->
                    Random.list n (Random.uniform x xs)
                        |> Random.map
                            (List.map
                                (\scale ->
                                    { duration = wn
                                    , scale = scale
                                    }
                                )
                            )
    in
    parts 32
        |> Random.andThen mkBossa
        |> Random.map (fromAbsPitchVolume >> Par (times 16 percussion) >> tempo (Ratio.over 3 2))


blueBossa : Random.Generator Music1
blueBossa =
    let
        cMin =
            [ C, D, Ef, F, G, Af, Bf ]

        fMin =
            [ F, G, Af, Bf, C, D, Ef ]

        dHalfDim =
            [ D, Ef, F, G, Af, Bf, C ]

        gDom =
            [ G, Af, Bf, B, D, Ef, F ]

        dfMaj =
            [ Df, Ef, F, Gf, Af, Bf, C ]

        eMin =
            [ Ef, F, Gf, Af, Bf, C, Df ]

        afDom =
            [ Af, Bf, C, Df, Ef, F, Gf ]

        part1 =
            [ LeadSheetPart bn cMin
            , LeadSheetPart bn fMin
            , LeadSheetPart wn dHalfDim
            , LeadSheetPart wn gDom
            , LeadSheetPart bn cMin
            ]

        part2 =
            [ LeadSheetPart wn eMin
            , LeadSheetPart wn afDom
            , LeadSheetPart bn dfMaj
            , LeadSheetPart wn dHalfDim
            , LeadSheetPart wn gDom
            , LeadSheetPart wn cMin
            , LeadSheetPart hn dHalfDim
            , LeadSheetPart hn gDom
            ]
    in
    (part1 ++ part2 ++ part1 ++ part2)
        |> mkBossa
        |> Random.map (fromAbsPitchVolume >> Par (times 16 percussion) >> tempo (Ratio.over 3 2))


percussion : Music1
percussion =
    let
        maracas =
            perc Maracas en |> times 16

        cl =
            perc Claves

        clave =
            line [ rest qn, cl dqn, cl dqn, cl dqn, cl dqn, cl qn ]
    in
    Par maracas clave |> Music.map (\p -> ( p, 40 )) |> fromPitchVolume


mkBossa : List LeadSheetPart -> Random.Generator MusicV
mkBossa leadSheet =
    case leadSheet of
        [] ->
            Random.constant empty

        part :: tail ->
            let
                notesFromScale =
                    List.range 60 71
                        |> List.filter (\p -> part.scale |> List.map pcToInt |> List.member (p |> modBy 12))

                bassRoot =
                    part.scale
                        |> List.Extra.getAt 0
                        |> Maybe.andThen (\pc -> List.range 36 48 |> List.Extra.find (\p -> modBy 12 p == pcToInt pc))

                bassFifth =
                    part.scale
                        |> List.Extra.getAt 4
                        |> Maybe.andThen (\pc -> List.range 36 48 |> List.Extra.find (\p -> modBy 12 p == pcToInt pc))

                mkBass root fifth =
                    line
                        [ note dqn ( root, 100 )
                        , note en ( fifth, 80 )
                        , note dqn ( fifth, 100 )
                        , note en ( root, 80 )
                        ]
                        |> times 8
                        |> instrument AcousticBass

                bass =
                    Maybe.map2 mkBass bassRoot bassFifth
                        |> Maybe.withDefault empty

                voicing =
                    List.range 60 71
                        |> List.filter
                            (\p ->
                                part.scale
                                    |> List.indexedMap Tuple.pair
                                    |> List.filterMap
                                        (\( i, pc ) ->
                                            if i == 0 || i == 2 || i == 6 then
                                                Just (pcToInt pc)

                                            else
                                                Nothing
                                        )
                                    |> List.member (p |> modBy 12)
                            )

                comping =
                    Random.list 16 (withRandomDur [ qn, qn, qn, qn, qn, qn, en ] 20 (\dur _ -> voicing |> List.map (note dur) |> chord |> Music.map (\p -> ( p, 25 ))))
                        |> Random.map (line >> instrument RhodesPiano)

                rythm =
                    comping |> Random.map (Par bass) |> Random.map (cut part.duration)

                mel =
                    randomMel part.duration notesFromScale [ qn, en, en, en ] 40
                        |> Random.map (instrument Vibraphone)

                rythmAndMel =
                    Random.map2 Par mel rythm
            in
            Random.map2 Seq rythmAndMel (mkBossa tail)


randomness : Random.Generator MusicV
randomness =
    let
        mel1 =
            randomMel (Ratio.fromInt 32) [ 60, 62, 63, 65, 67, 68, 70, 72, 73, 75, 77, 79 ] [ qn, en, en, en ] 60
                |> Random.map (instrument Vibraphone)

        mel2 =
            randomMel (Ratio.fromInt 32) [ 36, 36, 43, 43, 46, 48 ] [ hn, qn, qn, qn ] 20
                |> Random.map (instrument AcousticBass)
    in
    Random.map2 Par mel1 mel2
        |> Random.map (tempo (Ratio.fromInt 2))


randomMel : Dur -> List AbsPitch -> List Dur -> Int -> Random.Generator MusicV
randomMel dur pitches durs thres =
    let
        rndMel acc =
            if Ratio.gt (duration acc) dur then
                Random.constant (cut dur acc)

            else
                randomPrim pitches durs thres
                    |> Random.andThen (\m -> rndMel (Seq m acc))
    in
    rndMel empty


withRandomDur : List Dur -> Int -> (Dur -> Volume -> MusicV) -> Random.Generator MusicV
withRandomDur durs thres f =
    case durs of
        d :: ds ->
            let
                mkPrim dur vol =
                    if vol < thres then
                        rest dur

                    else
                        f dur vol
            in
            Random.map2
                mkPrim
                (Random.uniform d ds)
                (Random.int 0 70)

        [] ->
            Random.constant empty


randomPrim : List AbsPitch -> List Dur -> Int -> Random.Generator MusicV
randomPrim pitches durs thres =
    case ( pitches, durs ) of
        ( p :: ps, d :: ds ) ->
            let
                mkPrim ap dur vol =
                    if vol < thres then
                        rest dur

                    else
                        note dur ( ap, vol )
            in
            Random.map3
                mkPrim
                (Random.uniform p ps)
                (Random.uniform d ds)
                (Random.int 0 127)

        _ ->
            Random.constant empty

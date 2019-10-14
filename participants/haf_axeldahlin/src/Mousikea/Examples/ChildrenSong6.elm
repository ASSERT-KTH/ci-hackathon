module Mousikea.Examples.ChildrenSong6 exposing (childSong6)

import Mousikea.Music as Music exposing (..)
import Mousikea.Primitive exposing (Dur, Primitive(..))
import Mousikea.Util.Ratio exposing (add, div, divByInt, mul, mulByInt, over)


addDur : Dur -> List (Dur -> Music a) -> Music a
addDur dur ns =
    let
        f n =
            n dur
    in
    line (List.map f ns)


graceNote : Int -> Music Pitch -> Music Pitch
graceNote n m =
    case m of
        Prim (Note dur p) ->
            Seq
                (note (divByInt dur 8) (trans n p))
                (note (mulByInt (divByInt dur 8) 7) p)

        _ ->
            m


childSong6 : Music1
childSong6 =
    let
        t =
            mul (div dhn qn) (over 69 120)
    in
    instrument RhodesPiano
        (tempo t (Par bassLine mainVoice))
        |> Music.map (\p -> ( p, [ Volume 60 ] ))


bassLine : Music Pitch
bassLine =
    let
        b1 =
            addDur dqn [ b 2, fs 3, g 3, fs 3 ]

        b2 =
            addDur dqn [ b 2, es 3, fs 3, es 3 ]

        b3 =
            addDur dqn [ as_ 2, fs 3, g 3, fs 3 ]
    in
    line [ times 3 b1, times 2 b2, times 4 b3, times 5 b1 ]


mainVoice : Music Pitch
mainVoice =
    Seq (times 3 v1) v2


v1 : Music Pitch
v1 =
    let
        v1a =
            addDur en [ a 4, e_ 4, d 4, fs 4, cs 4, b 3, e_ 4, b 3 ]

        v1b =
            addDur en [ cs 4, b 3 ]
    in
    line [ v1a, graceNote -1 (d 4 qn), v1b ]


v2 : Music Pitch
v2 =
    let
        v2a =
            line
                [ cs 4 (add dhn dhn)
                , d 4 dhn
                , f 4 hn
                , gs 4 qn
                , fs 4 (add hn en)
                , g 4 en
                ]

        v2b =
            line
                [ addDur en [ fs 4, e_ 4, cs 4, as_ 3 ]
                , a 3 dqn
                , addDur en [ as_ 3, cs 4, fs 4, e_ 4, fs 4 ]
                ]

        v2c =
            line
                [ line [ g 4 en, as_ 4 en, cs 5 (add hn en), d 5 en, cs 5 en ]
                , e_ 4 en
                , enr
                , line [ as_ 4 en, a 4 en, g 4 en, d 4 qn, c 4 en, cs 4 en ]
                ]

        v2d =
            addDur en
                [ fs 4
                , cs 4
                , e_ 4
                , cs 4
                , a 3
                , as_ 3
                , d 4
                , e_ 4
                , fs 4
                ]

        v2e =
            line
                [ graceNote 2 (e_ 4 qn)
                , d 4 en
                , graceNote 2 (d 4 qn)
                , cs 4 en
                , graceNote 1 (cs 4 qn)
                , b 3 (add en hn)
                , cs 4 en
                , b 3 en
                ]

        v2f =
            line
                [ fs 4 en
                , a 4 en
                , b 4 (add hn qn)
                , a 4 en
                , fs 4 en
                , e_ 4 qn
                , d 4 en
                , fs 4 en
                , e_ 4 hn
                , d 4 hn
                , fs 4 qn
                ]

        v2g =
            Seq (tempo (over 3 2) (line [ cs 4 en, d 4 en, cs 4 en ])) (b 3 (add (mulByInt dhn 3) hn))
    in
    line [ v2a, v2b, v2c, v2d, v2e, v2f, v2g ]

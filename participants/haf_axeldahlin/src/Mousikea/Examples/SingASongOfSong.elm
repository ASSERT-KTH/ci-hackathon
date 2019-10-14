module Mousikea.Examples.SingASongOfSong exposing (song)

import Mousikea.Music as Music exposing (..)
import Mousikea.PercussionSound exposing (PercussionSound(..))
import Mousikea.Primitive exposing (Primitive(..))
import Mousikea.Util.Ratio as Ratio


drums : Music Pitch
drums =
    line (List.map (perc RideCymbal2) [ qn, qn, en, dqn, en, en, qn, qn, qn ])
        |> Par (line [ perc AcousticBassDrum dqn, perc AcousticBassDrum dqn, perc AcousticBassDrum qn ])
        |> Par (line [ rest wn, perc SideStick dqn, perc HighTom dqn, perc LowMidTom qn ])
        |> Par (times 4 (perc PedalHiHat hn))


bass1 : Music Pitch
bass1 =
    line [ e_ 2 dqn, b 2 dqn, gs 3 (Ratio.add qn wn) ]


bass2 : Music Pitch
bass2 =
    line [ e_ 2 dqn, b 2 dqn, e_ 3 (Ratio.add qn wn) ]


bass : Music Pitch
bass =
    line [ bass1, transpose -4 bass1, transpose -2 bass1, bass2 ]
        |> instrument AcousticBass


melody : Music Pitch
melody =
    let
        ending1 =
            e_ 4 (Ratio.add qn bn)

        ending2 =
            line [ e_ 4 (Ratio.add qn wn), rest hn, b 3 qn, d 4 qn ]

        m1 ending =
            line
                [ line [ gs 4 qn, fs 4 en, gs 4 en, a 4 qn, gs 4 en, fs 4 en ]
                , line [ rest en, e_ 4 dqn, b 3 en, d 4 en, e_ 4 (Ratio.add qn bn) ]
                , line [ fs 4 qn, e_ 4 en, fs 4 en, g 4 qn, fs 4 en, e_ 4 en ]
                , line [ rest en, d 4 dqn, b 3 en, d 4 en, ending ]
                ]

        m2 ending =
            line
                [ line [ e_ 4 wn, rest hn, rest en, e_ 4 qn, d 4 en ]
                , line [ c 4 wn, rest hn, rest en, a 3 qn, c 4 en ]
                , line [ d 4 wn, rest hn, rest en, b 3 qn, d 4 en ]
                , line [ e_ 4 wn, rest hn, ending ]
                ]
    in
    line [ m1 ending1, m1 ending2, m2 (line [ b 3 qn, d 4 qn ]), m2 (rest hn) ]
        |> instrument RhodesPiano


rythm : Music Pitch
rythm =
    Par (times 4 drums) bass


song : Music1
song =
    Seq rythm (Par (times 4 rythm) melody |> times 2)
        |> times 2
        |> tempo (Ratio.mul (Ratio.div qn qn) (Ratio.over 200 120))
        |> Music.map (\p -> ( p, [ Volume 60 ] ))

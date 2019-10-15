module Mousikea.Examples.Drums exposing (africanDrumBeat, simpleBeat)

import Mousikea.Music as Music exposing (..)
import Mousikea.PercussionSound exposing (PercussionSound(..))
import Mousikea.Primitive exposing (Primitive(..))
import Mousikea.Util.Ratio as Ratio


simpleBeat : Music1
simpleBeat =
    times 4 (perc AcousticBassDrum qn)
        |> Par (times 8 (perc ClosedHiHat en))
        |> Par (line [ rest qn, Par (perc AcousticSnare qn) (perc HandClap qn) ] |> times 2)
        |> times 16
        |> Music.map (\p -> ( p, [ Volume 60 ] ))


africanDrumBeat : Music1
africanDrumBeat =
    line [ perc RideBell qn, perc RideBell qn, perc RideBell qn, rest en, perc RideBell qn, perc RideBell qn, rest en ]
        |> Par (times 4 (perc AcousticBassDrum dqn))
        |> Par (times 6 (perc PedalHiHat qn))
        |> Par (line [ rest qn, perc SideStick en, rest en, perc HighTom en |> times 2, rest qn, perc SideStick en, rest en, perc LowTom en |> times 2 ])
        |> times 16
        |> tempo (Ratio.mul (Ratio.div dqn qn) (Ratio.over 120 120))
        |> Music.map (\p -> ( p, [ Volume 60 ] ))

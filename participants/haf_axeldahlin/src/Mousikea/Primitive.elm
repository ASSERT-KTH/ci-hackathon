module Mousikea.Primitive exposing
    ( Dur
    , Primitive(..)
    , map
    )

import Mousikea.Util.Ratio exposing (Rational)


{-| Duration [0, 127] in Midi convention
-}
type alias Dur =
    Rational


{-| Either a `Note Dur a` or a `Rest Dur`
-}
type Primitive a
    = Note Dur a
    | Rest Dur


map : (a -> b) -> Primitive a -> Primitive b
map func prim =
    case prim of
        Note dur x ->
            Note dur (func x)

        Rest dur ->
            Rest dur

module Mousikea.PercussionSound exposing (PercussionSound(..), fromEnum)


type PercussionSound
    = AcousticBassDrum --  MIDI Key 35
    | BassDrum1 --  MIDI Key 36
    | SideStick --  ...
    | AcousticSnare
    | HandClap
    | ElectricSnare
    | LowFloorTom
    | ClosedHiHat
    | HighFloorTom
    | PedalHiHat
    | LowTom
    | OpenHiHat
    | LowMidTom
    | HiMidTom
    | CrashCymbal1
    | HighTom
    | RideCymbal1
    | ChineseCymbal
    | RideBell
    | Tambourine
    | SplashCymbal
    | Cowbell
    | CrashCymbal2
    | Vibraslap
    | RideCymbal2
    | HiBongo
    | LowBongo
    | MuteHiConga
    | OpenHiConga
    | LowConga
    | HighTimbale
    | LowTimbale
    | HighAgogo
    | LowAgogo
    | Cabasa
    | Maracas
    | ShortWhistle
    | LongWhistle
    | ShortGuiro
    | LongGuiro
    | Claves
    | HiWoodBlock
    | LowWoodBlock
    | MuteCuica
    | OpenCuica
    | MuteTriangle
    | OpenTriangle --  MIDI Key 81


fromEnum : PercussionSound -> Int
fromEnum pc =
    case pc of
        AcousticBassDrum ->
            0

        BassDrum1 ->
            1

        SideStick ->
            2

        AcousticSnare ->
            3

        HandClap ->
            4

        ElectricSnare ->
            5

        LowFloorTom ->
            6

        ClosedHiHat ->
            7

        HighFloorTom ->
            8

        PedalHiHat ->
            9

        LowTom ->
            10

        OpenHiHat ->
            11

        LowMidTom ->
            12

        HiMidTom ->
            13

        CrashCymbal1 ->
            14

        HighTom ->
            15

        RideCymbal1 ->
            16

        ChineseCymbal ->
            17

        RideBell ->
            18

        Tambourine ->
            19

        SplashCymbal ->
            20

        Cowbell ->
            21

        CrashCymbal2 ->
            22

        Vibraslap ->
            23

        RideCymbal2 ->
            24

        HiBongo ->
            25

        LowBongo ->
            26

        MuteHiConga ->
            27

        OpenHiConga ->
            28

        LowConga ->
            29

        HighTimbale ->
            30

        LowTimbale ->
            31

        HighAgogo ->
            32

        LowAgogo ->
            33

        Cabasa ->
            34

        Maracas ->
            35

        ShortWhistle ->
            36

        LongWhistle ->
            37

        ShortGuiro ->
            38

        LongGuiro ->
            39

        Claves ->
            40

        HiWoodBlock ->
            41

        LowWoodBlock ->
            42

        MuteCuica ->
            43

        OpenCuica ->
            44

        MuteTriangle ->
            45

        OpenTriangle ->
            46

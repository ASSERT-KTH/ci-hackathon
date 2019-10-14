port module WebAudioFont exposing (queueWavTable, stop)

import Json.Encode exposing (Value)
import List.Extra
import Mousikea.Midi.MEvent exposing (MEvent, Performance)
import Mousikea.Music exposing (AbsPitch, InstrumentName(..))
import Mousikea.Util.Ratio as Ratio


port play : Value -> Cmd msg


port stop : () -> Cmd msg


queueWavTable : Performance -> Cmd msg
queueWavTable =
    fromPerformance >> encode >> play


type alias WebAudioFontPerformance =
    { instruments : List Int
    , drums : List Int
    , events : List WebAudioFontEvent
    }


type Instrument
    = Regular Int
    | Perc Int


type alias WebAudioFontEvent =
    { time : Float
    , instrument : Instrument
    , pitch : Int
    , duration : Float
    , volume : Float
    }


encode : WebAudioFontPerformance -> Value
encode { instruments, events, drums } =
    Json.Encode.object
        [ ( "instruments", Json.Encode.list Json.Encode.int instruments )
        , ( "events", Json.Encode.list encodeEvent events )
        , ( "drums", Json.Encode.list Json.Encode.int drums )
        ]


encodeEvent : WebAudioFontEvent -> Value
encodeEvent { time, instrument, pitch, duration, volume } =
    Json.Encode.object
        [ ( "time", Json.Encode.float time )
        , ( "instrument", encodeInstrument instrument )
        , ( "pitch", Json.Encode.int pitch )
        , ( "duration", Json.Encode.float duration )
        , ( "volume", Json.Encode.float volume )
        ]


encodeInstrument : Instrument -> Value
encodeInstrument instrument =
    case instrument of
        Regular n ->
            Json.Encode.object [ ( "type", Json.Encode.string "regular" ), ( "key", Json.Encode.int n ) ]

        Perc n ->
            Json.Encode.object [ ( "type", Json.Encode.string "percussion" ), ( "key", Json.Encode.int n ) ]


fromPerformance : Performance -> WebAudioFontPerformance
fromPerformance performance =
    let
        events =
            performance |> List.map fromMEvent

        regular instr =
            case instr of
                Regular n ->
                    [ n ]

                _ ->
                    []

        perc instr =
            case instr of
                Perc n ->
                    [ n ]

                _ ->
                    []
    in
    { instruments = events |> List.concatMap (.instrument >> regular) |> List.Extra.unique
    , drums = events |> List.concatMap (.instrument >> perc) |> List.Extra.unique
    , events = events
    }


fromMEvent : MEvent -> WebAudioFontEvent
fromMEvent { eTime, eInst, ePitch, eDur, eVol } =
    { time = Ratio.toFloat eTime
    , instrument =
        case eInst of
            Percussion ->
                Perc (toInstrumentNumber eInst ePitch + 0)

            _ ->
                Regular (toInstrumentNumber eInst ePitch)
    , pitch = ePitch
    , duration = Ratio.toFloat eDur
    , volume = toFloat eVol / 127
    }


toInstrumentNumber : InstrumentName -> AbsPitch -> Int
toInstrumentNumber instrument pitch =
    case instrument of
        AcousticGrandPiano ->
            0

        BrightAcousticPiano ->
            11

        ElectricGrandPiano ->
            22

        HonkyTonkPiano ->
            32

        RhodesPiano ->
            45

        ChorusedPiano ->
            58

        Harpsichord ->
            70

        Clavinet ->
            81

        Celesta ->
            89

        Glockenspiel ->
            99

        MusicBox ->
            107

        Vibraphone ->
            116

        Marimba ->
            124

        Xylophone ->
            133

        TubularBells ->
            141

        Dulcimer ->
            152

        HammondOrgan ->
            160

        PercussiveOrgan ->
            170

        RockOrgan ->
            180

        ChurchOrgan ->
            190

        ReedOrgan ->
            200

        Accordion ->
            211

        Harmonica ->
            223

        TangoAccordion ->
            231

        AcousticGuitarNylon ->
            244

        AcousticGuitarSteel ->
            256

        ElectricGuitarJazz ->
            274

        ElectricGuitarClean ->
            286

        ElectricGuitarMuted ->
            299

        OverdrivenGuitar ->
            315

        DistortionGuitar ->
            333

        GuitarHarmonics ->
            354

        AcousticBass ->
            366

        ElectricBassFingered ->
            375

        ElectricBassPicked ->
            384

        FretlessBass ->
            393

        SlapBass1 ->
            401

        SlapBass2 ->
            409

        SynthBass1 ->
            418

        SynthBass2 ->
            434

        Violin ->
            447

        Viola ->
            458

        Cello ->
            466

        Contrabass ->
            475

        TremoloStrings ->
            483

        PizzicatoStrings ->
            492

        OrchestralHarp ->
            500

        Timpani ->
            508

        StringEnsemble1 ->
            517

        StringEnsemble2 ->
            544

        SynthStrings1 ->
            553

        SynthStrings2 ->
            567

        ChoirAahs ->
            576

        VoiceOohs ->
            588

        SynthVoice ->
            600

        OrchestraHit ->
            608

        Trumpet ->
            617

        Trombone ->
            624

        Tuba ->
            632

        MutedTrumpet ->
            640

        FrenchHorn ->
            648

        BrassSection ->
            659

        SynthBrass1 ->
            671

        SynthBrass2 ->
            683

        SopranoSax ->
            695

        AltoSax ->
            703

        TenorSax ->
            712

        BaritoneSax ->
            721

        Oboe ->
            729

        Bassoon ->
            737

        EnglishHorn ->
            745

        Clarinet ->
            754

        Piccolo ->
            762

        Flute ->
            771

        Recorder ->
            781

        PanFlute ->
            789

        BlownBottle ->
            800

        Shakuhachi ->
            811

        Whistle ->
            821

        Ocarina ->
            829

        Lead1Square ->
            837

        Lead2Sawtooth ->
            846

        Lead3Calliope ->
            856

        Lead4Chiff ->
            868

        Lead5Charang ->
            878

        Lead6Voice ->
            892

        Lead7Fifths ->
            903

        Lead8BassLead ->
            913

        Pad1NewAge ->
            923

        Pad2Warm ->
            944

        Pad3Polysynth ->
            954

        Pad4Choir ->
            965

        Pad5Bowed ->
            976

        Pad6Metallic ->
            986

        Pad7Halo ->
            997

        Pad8Sweep ->
            1008

        FX1Train ->
            1017

        FX2Soundtrack ->
            1029

        FX3Crystal ->
            1039

        FX4Atmosphere ->
            1053

        FX5Brightness ->
            1069

        FX6Goblins ->
            1084

        FX7Echoes ->
            1095

        FX8SciFi ->
            1108

        Sitar ->
            1120

        Banjo ->
            1129

        Shamisen ->
            1137

        Koto ->
            1147

        Kalimba ->
            1158

        Bagpipe ->
            1166

        Fiddle ->
            1174

        Shanai ->
            1185

        TinkleBell ->
            1192

        Agogo ->
            1200

        SteelDrums ->
            1209

        Woodblock ->
            1217

        TaikoDrum ->
            1228

        MelodicDrum ->
            1241

        SynthDrum ->
            1252

        ReverseCymbal ->
            1262

        GuitarFretNoise ->
            1273

        BreathNoise ->
            1283

        Seashore ->
            1293

        BirdTweet ->
            1311

        TelephoneRing ->
            1324

        Helicopter ->
            1339

        Applause ->
            1365

        Gunshot ->
            1382

        Percussion ->
            toPercussionInstrumentNumber pitch

        _ ->
            0


toPercussionInstrumentNumber : AbsPitch -> Int
toPercussionInstrumentNumber pitch =
    case pitch of
        35 ->
            0

        36 ->
            5

        37 ->
            10

        38 ->
            15

        39 ->
            20

        40 ->
            25

        41 ->
            30

        42 ->
            35

        43 ->
            40

        44 ->
            45

        45 ->
            50

        46 ->
            55

        47 ->
            60

        48 ->
            65

        49 ->
            70

        50 ->
            75

        51 ->
            80

        52 ->
            85

        53 ->
            90

        54 ->
            95

        55 ->
            100

        56 ->
            105

        57 ->
            110

        58 ->
            115

        59 ->
            120

        60 ->
            125

        61 ->
            130

        62 ->
            135

        63 ->
            140

        64 ->
            145

        65 ->
            150

        66 ->
            155

        67 ->
            160

        68 ->
            165

        69 ->
            170

        70 ->
            175

        71 ->
            180

        72 ->
            185

        73 ->
            190

        74 ->
            195

        75 ->
            200

        76 ->
            205

        77 ->
            210

        78 ->
            215

        79 ->
            220

        80 ->
            225

        81 ->
            230

        _ ->
            0

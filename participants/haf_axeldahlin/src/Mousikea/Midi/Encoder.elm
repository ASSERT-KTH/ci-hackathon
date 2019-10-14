module Mousikea.Midi.Encoder exposing (mEvent)

import Json.Encode as Encode exposing (Value)
import Mousikea.Midi.MEvent exposing (MEvent)
import Mousikea.Types exposing (InstrumentName(..))
import Mousikea.Util.Ratio as Ratio


mEvent : MEvent -> Value
mEvent { eTime, eInst, ePitch, eDur, eVol, eParams } =
    Encode.object
        [ ( "eTime", Encode.float (Ratio.toFloat eTime) )
        , ( "eInst", Encode.string (instrument eInst) )
        , ( "ePitch", Encode.int ePitch )
        , ( "eDur", Encode.float (Ratio.toFloat eDur) )
        , ( "eVol", Encode.int eVol )
        , ( "eParams", Encode.list Encode.float eParams )
        ]


instrument : InstrumentName -> String
instrument instrumentName =
    case instrumentName of
        AcousticGrandPiano ->
            "AcousticGrandPiano"

        BrightAcousticPiano ->
            "BrightAcousticPiano"

        ElectricGrandPiano ->
            "ElectricGrandPiano"

        HonkyTonkPiano ->
            "HonkyTonkPiano"

        RhodesPiano ->
            "RhodesPiano"

        ChorusedPiano ->
            "ChorusedPiano"

        Harpsichord ->
            "Harpsichord"

        Clavinet ->
            "Clavinet"

        Celesta ->
            "Celesta"

        Glockenspiel ->
            "Glockenspiel"

        MusicBox ->
            "MusicBox"

        Vibraphone ->
            "Vibraphone"

        Marimba ->
            "Marimba"

        Xylophone ->
            "Xylophone"

        TubularBells ->
            "TubularBells"

        Dulcimer ->
            "Dulcimer"

        HammondOrgan ->
            "HammondOrgan"

        PercussiveOrgan ->
            "PercussiveOrgan"

        RockOrgan ->
            "RockOrgan"

        ChurchOrgan ->
            "ChurchOrgan"

        ReedOrgan ->
            "ReedOrgan"

        Accordion ->
            "Accordion"

        Harmonica ->
            "Harmonica"

        TangoAccordion ->
            "TangoAccordion"

        AcousticGuitarNylon ->
            "AcousticGuitarNylon"

        AcousticGuitarSteel ->
            "AcousticGuitarSteel"

        ElectricGuitarJazz ->
            "ElectricGuitarJazz"

        ElectricGuitarClean ->
            "ElectricGuitarClean"

        ElectricGuitarMuted ->
            "ElectricGuitarMuted"

        OverdrivenGuitar ->
            "OverdrivenGuitar"

        DistortionGuitar ->
            "DistortionGuitar"

        GuitarHarmonics ->
            "GuitarHarmonics"

        AcousticBass ->
            "AcousticBass"

        ElectricBassFingered ->
            "ElectricBassFingered"

        ElectricBassPicked ->
            "ElectricBassPicked"

        FretlessBass ->
            "FretlessBass"

        SlapBass1 ->
            "SlapBass1"

        SlapBass2 ->
            "SlapBass2"

        SynthBass1 ->
            "SynthBass1"

        SynthBass2 ->
            "SynthBass2"

        Violin ->
            "Violin"

        Viola ->
            "Viola"

        Cello ->
            "Cello"

        Contrabass ->
            "Contrabass"

        TremoloStrings ->
            "TremoloStrings"

        PizzicatoStrings ->
            "PizzicatoStrings"

        OrchestralHarp ->
            "OrchestralHarp"

        Timpani ->
            "Timpani"

        StringEnsemble1 ->
            "StringEnsemble1"

        StringEnsemble2 ->
            "StringEnsemble2"

        SynthStrings1 ->
            "SynthStrings1"

        SynthStrings2 ->
            "SynthStrings2"

        ChoirAahs ->
            "ChoirAahs"

        VoiceOohs ->
            "VoiceOohs"

        SynthVoice ->
            "SynthVoice"

        OrchestraHit ->
            "OrchestraHit"

        Trumpet ->
            "Trumpet"

        Trombone ->
            "Trombone"

        Tuba ->
            "Tuba"

        MutedTrumpet ->
            "MutedTrumpet"

        FrenchHorn ->
            "FrenchHorn"

        BrassSection ->
            "BrassSection"

        SynthBrass1 ->
            "SynthBrass1"

        SynthBrass2 ->
            "SynthBrass2"

        SopranoSax ->
            "SopranoSax"

        AltoSax ->
            "AltoSax"

        TenorSax ->
            "TenorSax"

        BaritoneSax ->
            "BaritoneSax"

        Oboe ->
            "Oboe"

        Bassoon ->
            "Bassoon"

        EnglishHorn ->
            "EnglishHorn"

        Clarinet ->
            "Clarinet"

        Piccolo ->
            "Piccolo"

        Flute ->
            "Flute"

        Recorder ->
            "Recorder"

        PanFlute ->
            "PanFlute"

        BlownBottle ->
            "BlownBottle"

        Shakuhachi ->
            "Shakuhachi"

        Whistle ->
            "Whistle"

        Ocarina ->
            "Ocarina"

        Lead1Square ->
            "Lead1Square"

        Lead2Sawtooth ->
            "Lead2Sawtooth"

        Lead3Calliope ->
            "Lead3Calliope"

        Lead4Chiff ->
            "Lead4Chiff"

        Lead5Charang ->
            "Lead5Charang"

        Lead6Voice ->
            "Lead6Voice"

        Lead7Fifths ->
            "Lead7Fifths"

        Lead8BassLead ->
            "Lead8BassLead"

        Pad1NewAge ->
            "Pad1NewAge"

        Pad2Warm ->
            "Pad2Warm"

        Pad3Polysynth ->
            "Pad3Polysynth"

        Pad4Choir ->
            "Pad4Choir"

        Pad5Bowed ->
            "Pad5Bowed"

        Pad6Metallic ->
            "Pad6Metallic"

        Pad7Halo ->
            "Pad7Halo"

        Pad8Sweep ->
            "Pad8Sweep"

        FX1Train ->
            "FX1Train"

        FX2Soundtrack ->
            "FX2Soundtrack"

        FX3Crystal ->
            "FX3Crystal"

        FX4Atmosphere ->
            "FX4Atmosphere"

        FX5Brightness ->
            "FX5Brightness"

        FX6Goblins ->
            "FX6Goblins"

        FX7Echoes ->
            "FX7Echoes"

        FX8SciFi ->
            "FX8SciFi"

        Sitar ->
            "Sitar"

        Banjo ->
            "Banjo"

        Shamisen ->
            "Shamisen"

        Koto ->
            "Koto"

        Kalimba ->
            "Kalimba"

        Bagpipe ->
            "Bagpipe"

        Fiddle ->
            "Fiddle"

        Shanai ->
            "Shanai"

        TinkleBell ->
            "TinkleBell"

        Agogo ->
            "Agogo"

        SteelDrums ->
            "SteelDrums"

        Woodblock ->
            "Woodblock"

        TaikoDrum ->
            "TaikoDrum"

        MelodicDrum ->
            "MelodicDrum"

        SynthDrum ->
            "SynthDrum"

        ReverseCymbal ->
            "ReverseCymbal"

        GuitarFretNoise ->
            "GuitarFretNoise"

        BreathNoise ->
            "BreathNoise"

        Seashore ->
            "Seashore"

        BirdTweet ->
            "BirdTweet"

        TelephoneRing ->
            "TelephoneRing"

        Helicopter ->
            "Helicopter"

        Applause ->
            "Applause"

        Gunshot ->
            "Gunshot"

        Percussion ->
            "Percussion"

        CustomInstrument name ->
            name

// import ControlInterface from "../components/ControlInterface.tsx"
import { useEffect } from "preact/hooks"
import { useSignal, Signal, signal } from "@preact/signals"
import Knob from "./Knob.tsx"

const v: Signal <number> [] = []

for (let i = 0; i < 24; i++) {
   v.push (signal<number> (0))
}

export default function Control () {

   const matrix = []
   const w = (globalThis.innerWidth / 2) - 400
   const h = (globalThis.innerHeight / 2) - 150

   for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 8; i++) {
         matrix.push (
            <Knob 
               size={ 100 } 
               control={ 8 + i + (j * 8)}
               value={ v[i + (j * 8)].value }
               position={{ x: i * 100 + w, y: j * 100 + h }}
            />
         )
      }   
   }

   useEffect (() => {
      const midi_handler = (e: MIDIMessageEvent) => {
         const [status, control, value] = e.data as Uint8Array
         if (status === 176) {
            v[control - 8].value = Number (value)
         }
      }

      const init_midi = async () => {
         const midi = await navigator.requestMIDIAccess ()
         midi.inputs.forEach (device => {
            device.onmidimessage = midi_handler
         })

         midi.onstatechange = (e: Event) => {
            const midi_event = e as MIDIConnectionEvent
            if (midi_event.port instanceof MIDIInput && midi_event.port.state === `connected`) {
               midi_event.port.onmidimessage = midi_handler
            }
         }
      }

      init_midi ()
   }, [])


   return <div style="
      background: darkmagenta;
      position: absolute;
      user-select: none;
      height: 100vh;
      width: 100vw;
      color: white;
      left: 0;
      top: 0;
   ">{ matrix }</div>
}
import ControlInterface from "../components/ControlInterface.tsx"

const submit = async (e: SubmitEvent) => {
   e.preventDefault ()
   const form = e.target as HTMLFormElement
   const data = new FormData (form)
   const obj = Object.fromEntries (data)

   const is_playing = obj.is_playing === `on`
   const frequency = parseFloat (obj.frequency)
   const lag_time = parseFloat (obj.lag_time, 10)
   const amplitude = parseFloat (obj.amplitude)

   const payload = {
      is_playing,
      frequency,
      lag_time,
      amplitude
   }

   const json = JSON.stringify (payload)

   const res = await fetch (`/api/update`, {
      method: `POST`,
      headers: {
         'Content-Type': 'application/json'
      },
      body: json
   })
}

export default function Control () {
   return (<ControlInterface submit={ submit }/>)
}
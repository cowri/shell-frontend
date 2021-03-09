import { useEffect, useState } from 'react'

function useSubject(subject, initValue = undefined) {
    // if useSubject provided with initValue use it, else use subject value
    const [value, setValue] = useState(initValue || subject.getValue())

    useEffect(() => {
        const subscription = subject.subscribe(newValue => {
            setValue(newValue)
        })
        return () => subscription.unsubscribe()
    })

    return value
}

export default useSubject

// @flow
import * as React from 'react'

const style = {
    clip: 'rect(0 0 0 0)',
    height: '100%',
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    userSelect: 'none',
    width: '100%'
}

const getElement = target => target && target.contentDocument && target.contentDocument.defaultView

export default function useAboutBlank(setElement, ignore) {
    const ref = React.useRef()

    const onLoad = React.useCallback(() => {
        const target = ref.current
        const element = getElement(target)
        if (element) setElement(element)
        else setTimeout(onLoad, 50)
    }, [setElement])

    React.useEffect(() => {
        const target = ref.current
        const element = getElement(target)
        if (element) setElement(element)
        else if (target && 'addEventListener' in target) target.addEventListener('load', onLoad)
        return () => {
            setElement(null)
        }
    }, [onLoad, setElement])

    if (ignore) return null

    return (
        <iframe
            aria-hidden
            frameBorder={0}
            ref={ref}
            src="about:blank"
            style={style}
            tabIndex={-1}
            title="blank"
        />
    )
}

// @flow
import * as React from 'react'

import useAboutBlank from './useAboutBlank'

const storage = new WeakMap()

export default function useQueries(queries, target) {
    const [activeItems, setActiveItems] = React.useState([])
    const [element, setElement] = React.useState(target || null)
    const reactElement = useAboutBlank(setElement, target != null)

    const mediaQueries = React.useMemo(() => {
        if (!element || !('matchMedia' in element)) return []
        if (!storage.has(element)) storage.set(element, new Map())
        const matchMedias = storage.get(element)
        return Object.keys(queries).map(key => {
            if (!matchMedias.has(key)) matchMedias.set(key, element.matchMedia(key))
            return { mq: matchMedias.get(key), value: queries[key] }
        })
    }, [element, queries])

    const updateQueries = React.useCallback(() => {
        const nextActiveItems = mediaQueries.reduce((nextActiveItems, item) => {
            if (item.mq.matches) nextActiveItems.push(item.value)
            return nextActiveItems
        }, [])
        if (
            nextActiveItems.length !== activeItems.length ||
            nextActiveItems.some((activeItem, index) => activeItems[index] !== activeItem)
        ) {
            setActiveItems(nextActiveItems)
        }
    }, [activeItems, mediaQueries])

    React.useEffect(() => {
        if (mediaQueries.length === 0) return
        updateQueries()
        mediaQueries.forEach(item => {
            item.mq.addListener(updateQueries)
        })
        return () => {
            mediaQueries.forEach(item => {
                item.mq.removeListener(updateQueries)
            })
        }
    }, [mediaQueries, updateQueries])

    return [activeItems, reactElement]
}

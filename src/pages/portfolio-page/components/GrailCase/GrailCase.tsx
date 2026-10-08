import { useRef } from 'react'
import grail from '@/assets/clients/get-my-grail.svg'
import cardReference from '@/assets/portfolio/card-reference.png'
import { resolveAssets, useCaseMarkup } from '../../useCaseMarkup'
import { initGrailDemo } from './grailDemoEngine'
import template from './grail-case.html?raw'
import './grail-demo.css'
import './grail-preflight.css'

const MARKUP = resolveAssets(template, {
    'assets/clients/get-my-grail.svg': grail,
    'assets/get-my-grail/card-reference.png': cardReference,
})

export function GrailCase() {
    const ref = useRef<HTMLElement>(null)
    useCaseMarkup(ref, MARKUP, initGrailDemo)

    return <section ref={ref} id="grail-case" className="grail-case" aria-labelledby="grail-title" />
}

import { useRef } from 'react'
import gustav from '@/assets/clients/gustav.svg'
import { resolveAssets, useCaseMarkup } from '../../useCaseMarkup'
import { initGustavDemo } from './gustavDemoEngine'
import template from './gustav-case.html?raw'
import './gustav-demo.css'
import './gustav-preflight.css'

const MARKUP = resolveAssets(template, { 'assets/clients/gustav.svg': gustav })

export function GustavCase() {
    const ref = useRef<HTMLElement>(null)
    useCaseMarkup(ref, MARKUP, initGustavDemo)

    return <section ref={ref} id="gustav-case" className="gustav-case" aria-labelledby="gustav-title" />
}

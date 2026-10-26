import { useRef } from 'react'
import evo from '@/assets/clients/evo.svg'
import { resolveAssets, useCaseMarkup } from '../useCaseMarkup'
import { initEvoDemo } from './evoDemoEngine'
import template from './evo-case/evo-case.html?raw'
import './evo-case/evo-demo.css'

const MARKUP = resolveAssets(template, { 'assets/clients/evo.svg': evo })

export function EvoCase() {
    const ref = useRef<HTMLDivElement>(null)
    useCaseMarkup(ref, MARKUP, initEvoDemo)
    return <div ref={ref} />
}

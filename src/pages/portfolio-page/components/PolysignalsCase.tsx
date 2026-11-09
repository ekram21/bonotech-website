import { useRef } from 'react'
import polysignals from '@/assets/clients/polysignals-light.svg'
import { resolveAssets, useCaseMarkup } from '../useCaseMarkup'
import { initPolysignalsDemo } from './polysignalsDemoEngine'
import template from './polysignals-case/polysignals-case.html?raw'
import './polysignals-case/polysignals-demo.css'

const MARKUP = resolveAssets(template, { 'assets/clients/polysignals-light.svg': polysignals })

export function PolysignalsCase() {
    const ref = useRef<HTMLDivElement>(null)
    useCaseMarkup(ref, MARKUP, initPolysignalsDemo)
    return <div ref={ref} />
}

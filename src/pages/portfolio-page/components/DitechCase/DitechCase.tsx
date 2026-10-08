import { useRef } from 'react'
import ditech from '@/assets/clients/ditech.svg'
import chatgpt from '@/assets/service-tiers/chatgpt.svg'
import claude from '@/assets/service-tiers/claude.svg'
import { resolveAssets, useCaseMarkup } from '../../useCaseMarkup'
import { initDitechDemo } from './ditechDemoEngine'
import template from './ditech-case.html?raw'
import './ditech-demo.css'

const MARKUP = resolveAssets(template, {
    'assets/clients/ditech.svg': ditech,
    'assets/service-tiers/chatgpt.svg': chatgpt,
    'assets/service-tiers/claude.svg': claude,
})

export function DitechCase() {
    const ref = useRef<HTMLElement>(null)
    useCaseMarkup(ref, MARKUP, initDitechDemo)

    return <section ref={ref} id="ditech-case" className="ditech-case" aria-labelledby="ditech-title" />
}

import { useRef } from 'react'
import olmoLight from '@/assets/clients/olmo-light.svg'
import bathtub from '@/assets/portfolio/olmo-cracked-bathtub.jpg'
import { resolveAssets, useCaseMarkup } from '../../useCaseMarkup'
import { initOlmoDemo } from './olmoDemoEngine'
import template from './olmo-case.html?raw'
import './olmo-demo.css'

const MARKUP = resolveAssets(template, {
    'assets/clients/olmo-light.svg': olmoLight,
    'assets/olmo-cracked-bathtub.jpg': bathtub,
})

export function OlmoCase() {
    const ref = useRef<HTMLElement>(null)
    useCaseMarkup(ref, MARKUP, initOlmoDemo)

    return <section ref={ref} id="olmo-case" className="olmo-case" aria-labelledby="olmo-title" />
}

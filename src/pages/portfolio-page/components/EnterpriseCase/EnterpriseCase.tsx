import { useRef } from 'react'
import chatgpt from '@/assets/service-tiers/chatgpt.svg'
import claude from '@/assets/service-tiers/claude.svg'
import { resolveAssets, useCaseMarkup } from '../../useCaseMarkup'
import { initEnterpriseDemo } from './enterpriseDemoEngine'
import template from './enterprise-case.html?raw'
import './enterprise-demo.css'

const MARKUP = resolveAssets(template, {
    'assets/service-tiers/chatgpt.svg': chatgpt,
    'assets/service-tiers/claude.svg': claude,
})

export function EnterpriseCase() {
    const ref = useRef<HTMLElement>(null)
    useCaseMarkup(ref, MARKUP, initEnterpriseDemo)

    return <section ref={ref} id="enterprise-case" className="enterprise-case" aria-labelledby="enterprise-case-title" />
}

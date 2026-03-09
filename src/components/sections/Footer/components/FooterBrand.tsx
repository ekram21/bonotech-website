import { Mail } from 'lucide-react'
import bonotechLogo from '@/assets/bonotech-logo.png'

export function FooterBrand() {
    return (
        <div className="flex flex-col gap-6">
            {/* Logo — white monochrome on dark footer */}
            <img
                src={bonotechLogo}
                alt="Bonotech"
                className="select-none h-[30px] w-auto object-contain object-left brightness-0 invert opacity-90"
            />

            {/* Description */}
            <p className="font-body text-sm leading-7 font-normal text-white opacity-50 max-w-[300px]">
                Building innovative digital products that help
                businesses transition into the age of AI.
            </p>

            {/* Email */}
            <a
                href="mailto:contact@bonotech.io"
                className="group font-body text-sm leading-[1.5] font-medium text-white no-underline opacity-70 inline-flex items-center gap-2 transition-(--transition-base) hover:opacity-100"
            >
                <Mail
                    size={15}
                    className="opacity-60 group-hover:opacity-100 transition-(--transition-base)"
                />
                contact@bonotech.io
            </a>
        </div>
    )
}

import { Mail, Phone } from 'lucide-react'
import bonotechLogo from '@/assets/bonotech-logo.png'
import cloudSeal from '@/assets/01_cloud_seal_dark.svg'

export function FooterBrand() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <img
                    src={bonotechLogo}
                    alt="Bonotech"
                    className="select-none h-[30px] w-auto object-contain object-left brightness-0 invert opacity-90"
                />
                <img
                    src={cloudSeal}
                    alt="Secured by Axiler — protection live"
                    className="select-none h-auto w-full max-w-[200px] object-contain object-left opacity-90"
                />
            </div>

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

            <p className="font-body text-sm leading-7 font-normal text-white opacity-50 max-w-[300px]"> BONOTECH HOLDINGS PTE. LTD. <br />111 SOMERSET ROAD #08-10A <br /> Singapore 238164</p>
            <a
                href="tel:+447551829217"
                className="group font-body text-sm leading-7 font-normal text-white opacity-50 max-w-[300px] no-underline inline-flex items-center gap-2 transition-(--transition-base) hover:opacity-70"
            >
                <Phone
                    size={15}
                    className="opacity-60 group-hover:opacity-100 transition-(--transition-base)"
                />
                +44 7551 829217
            </a>
        </div>
    )
}

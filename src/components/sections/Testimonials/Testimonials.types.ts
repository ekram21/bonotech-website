export interface TestimonialData {
    id: string
    quote: string
    authorName: string
    authorRole: string
    /** Background color for the card */
    backgroundColor: string
    image?: string
}

export interface TestimonialsProps {
    className?: string
}

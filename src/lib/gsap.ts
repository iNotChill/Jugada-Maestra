import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.defaults({ ease: 'power3.out', duration: 1 })

/** Evita saltos de 1px por subpixel rendering en los pines. */
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }

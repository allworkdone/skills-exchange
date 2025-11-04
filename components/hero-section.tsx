import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Exchange Skills, <span className="text-primary">Build Community</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed max-w-2xl mx-auto">
            Connect with people in your area to trade skills without money. Learn guitar from a teacher who wants to
            build a website. Teach photography to someone who can help you learn Spanish.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="text-base px-6 py-6 sm:py-2">
              Browse Skills
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-transparent px-6 py-6 sm:py-2">
              List Your Skills
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
            Exchange Skills, <span className="text-primary">Build Community</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
            Connect with people in your area to trade skills without money. Learn guitar from a teacher who wants to
            build a website. Teach photography to someone who can help you learn Spanish.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="text-base">
              Browse Skills
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-transparent">
              List Your Skills
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

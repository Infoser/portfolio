import { useEffect } from 'react';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/design-system';
import { ThemeToggle } from '@/design-system';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t border-border pt-6 first:border-t-0 first:pt-0">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export default function Playground() {
  useEffect(() => {
    document.title = 'Playground — infoser_portfolio';
  }, []);

  return (
    <main className="min-h-dvh bg-background/0 text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              infoser_portfolio
            </p>
            <h1 className="font-display text-4xl font-medium tracking-tight">
              Playground
              <span className="ml-2 animate-blink text-primary font-mono">_</span>
            </h1>
          </div>
          <ThemeToggle />
        </header>

        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Every shadcn primitive wired into the design system, themed with our
          jade / amber / magenta palette. Toggle the theme — both states render
          correctly.
        </p>

        <Section title="Button">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </Section>

        <Section title="Badge">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </Section>

        <Section title="Input / Textarea">
          <Input placeholder="Email" className="w-56" />
          <Textarea placeholder="Bio" className="w-64" />
        </Section>

        <Section title="Tooltip">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>A tooltipfluencer.</TooltipContent>
          </Tooltip>
        </Section>

        <Section title="Dropdown Menu">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Menu
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => toast.success('Saved.')}>
                Save
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.error('Deleted.')}>
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Disabled</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Section>

        <Section title="Dialog">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>A dialog title</DialogTitle>
                <DialogDescription>
                  A description that explains what this dialog does, in plain English.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Continue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Section>

        <Section title="Sheet">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>A sheet</SheetTitle>
                <SheetDescription>Sliding panel content lives here.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </Section>

        <Section title="Tabs">
          <Tabs defaultValue="about" className="w-80">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>
            <TabsContent value="about">About content.</TabsContent>
            <TabsContent value="experience">Experience content.</TabsContent>
            <TabsContent value="projects">Projects content.</TabsContent>
          </Tabs>
        </Section>

        <Section title="Card">
          <Card className="w-72">
            <CardHeader>
              <CardTitle>Card title</CardTitle>
              <CardDescription>Card description.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Card body content goes here.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
        </Section>

        <Section title="Avatar">
          <Avatar>
            <AvatarFallback>IS</AvatarFallback>
          </Avatar>
        </Section>

        <Section title="Resizable">
          <ResizablePanelGroup
            orientation="horizontal"
            className="w-full max-w-md rounded-lg border border-border"
          >
            <ResizablePanel defaultSize={50} minSize={20}>
              <div className="flex h-20 items-center justify-center p-4 text-sm">
                Panel A
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50} minSize={20}>
              <div className="flex h-20 items-center justify-center p-4 text-sm">
                Panel B
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Section>

        <Section title="ScrollArea">
          <ScrollArea className="h-32 w-72 rounded-md border border-border p-2">
            <p className="text-sm">
              ScrollArea wraps overflow vertically and horizontally with themed
              scrollbars.
              {' — content — '.repeat(20)}
            </p>
          </ScrollArea>
        </Section>

        <Section title="Separator">
          <div className="flex w-full flex-col gap-3">
            <span className="text-sm">Above the separator</span>
            <Separator />
            <span className="text-sm">Below the separator</span>
          </div>
        </Section>
      </div>
    </main>
  );
}

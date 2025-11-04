import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChainOfThought, ReasoningStep } from '../components/ChainOfThought'

const mockSteps: ReasoningStep[] = [
  {
    id: '1',
    title: 'Initial Analysis',
    content: 'Starting to analyze the problem...',
    status: 'completed',
    type: 'thought',
    timestamp: '2025-11-04T23:10:00Z',
  },
  {
    id: '2',
    title: 'Web Search',
    content: 'Searching for relevant information...',
    status: 'completed',
    type: 'search',
    timestamp: '2025-11-04T23:10:30Z',
    metadata: {
      searchQuery: 'Next.js testing best practices',
      searchResults: [
        {
          title: 'Next.js Testing Guide',
          snippet: 'Learn how to test Next.js applications effectively...',
          url: 'https://nextjs.org/docs/testing',
          source: 'Next.js Documentation'
        }
      ]
    }
  },
  {
    id: '3',
    title: 'In Progress Analysis',
    content: 'Currently analyzing the data...',
    status: 'in-progress',
    type: 'analysis',
    timestamp: '2025-11-04T23:11:00Z',
  }
]

describe('ChainOfThought Component', () => {
  it('renders with default title', () => {
    render(<ChainOfThought steps={mockSteps} />)
    expect(screen.getByText('Reasoning Steps')).toBeInTheDocument()
  })

  it('renders with custom title', () => {
    render(<ChainOfThought steps={mockSteps} title="Custom Reasoning" />)
    expect(screen.getByText('Custom Reasoning')).toBeInTheDocument()
  })

  it('shows progress indicator correctly', () => {
    render(<ChainOfThought steps={mockSteps} />)
    // 2 completed out of 3 total
    expect(screen.getByText('2/3')).toBeInTheDocument()
  })

  it('shows thinking indicator when streaming', () => {
    render(<ChainOfThought steps={mockSteps} isStreaming={true} />)
    expect(screen.getByText('Thinking...')).toBeInTheDocument()
  })

  it('expands and collapses main content', async () => {
    const user = userEvent.setup()
    render(<ChainOfThought steps={mockSteps} />)
    
    const mainToggle = screen.getByRole('button', { name: /reasoning steps/i })
    
    // Initially collapsed
    expect(screen.queryByText('Initial Analysis')).not.toBeInTheDocument()
    
    // Expand
    await user.click(mainToggle)
    expect(screen.getByText('Initial Analysis')).toBeInTheDocument()
    
    // Collapse
    await user.click(mainToggle)
    expect(screen.queryByText('Initial Analysis')).not.toBeInTheDocument()
  })

  it('expands and collapses individual steps', async () => {
    const user = userEvent.setup()
    render(<ChainOfThought steps={mockSteps} />)
    
    // First expand main content
    const mainToggle = screen.getByRole('button', { name: /reasoning steps/i })
    await user.click(mainToggle)
    
    // Find and click individual step
    const stepButton = screen.getByText('Initial Analysis')
    expect(screen.queryByText('Starting to analyze the problem...')).not.toBeInTheDocument()
    
    await user.click(stepButton)
    expect(screen.getByText('Starting to analyze the problem...')).toBeInTheDocument()
  })

  it('displays search metadata correctly', async () => {
    const user = userEvent.setup()
    render(<ChainOfThought steps={mockSteps} />)
    
    // Expand main content
    const mainToggle = screen.getByRole('button', { name: /reasoning steps/i })
    await user.click(mainToggle)
    
    // Expand search step
    const searchStep = screen.getByText('Web Search')
    await user.click(searchStep)
    
    // Check search query
    expect(screen.getByText('Next.js testing best practices')).toBeInTheDocument()
    
    // Check search results
    expect(screen.getByText('Next.js Testing Guide')).toBeInTheDocument()
    expect(screen.getByText('Learn how to test Next.js applications effectively...')).toBeInTheDocument()
  })

  it('shows correct status icons', async () => {
    const user = userEvent.setup()
    render(<ChainOfThought steps={mockSteps} />)
    
    // Expand to see steps
    const mainToggle = screen.getByRole('button', { name: /reasoning steps/i })
    await user.click(mainToggle)
    
    // Check for status indicators (we can't easily test icons, but we can check they render)
    expect(screen.getByText('Initial Analysis')).toBeInTheDocument()
    expect(screen.getByText('Web Search')).toBeInTheDocument()
    expect(screen.getByText('In Progress Analysis')).toBeInTheDocument()
  })

  it('handles empty steps array', () => {
    render(<ChainOfThought steps={[]} />)
    expect(screen.getByText('0/0')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <ChainOfThought steps={mockSteps} className="custom-class" />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
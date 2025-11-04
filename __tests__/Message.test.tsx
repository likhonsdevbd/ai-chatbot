import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Message } from '../components/Message'
import { MessagePart } from '../lib/supabase'

// Mock the ChainOfThought component
jest.mock('../components/ChainOfThought', () => ({
  ChainOfThought: ({ title, steps }: any) => (
    <div data-testid="chain-of-thought">
      <span>{title}</span>
      <span>{steps.length} steps</span>
    </div>
  )
}))

const mockTextPart: MessagePart = {
  type: 'text',
  text: 'Hello, this is a test message!'
}

const mockReasoningPart: MessagePart = {
  type: 'reasoning',
  text: 'This is reasoning content...'
}

const mockChainOfThoughtPart: MessagePart = {
  type: 'chain-of-thought',
  reasoningSteps: [
    {
      id: '1',
      title: 'Test Step',
      content: 'Test content',
      status: 'completed'
    }
  ]
}

const mockToolCallPart: MessagePart = {
  type: 'tool-call',
  name: 'search_web',
  text: JSON.stringify({ query: 'test query' })
}

const mockToolResultPart: MessagePart = {
  type: 'tool-result',
  result: { data: 'test result' }
}

const mockSourceUrlPart: MessagePart = {
  type: 'source-url',
  url: 'https://example.com'
}

describe('Message Component', () => {
  it('renders user message correctly', () => {
    render(
      <Message 
        role="user" 
        parts={[mockTextPart]} 
      />
    )
    
    expect(screen.getByText('Hello, this is a test message!')).toBeInTheDocument()
    // User messages don't have copy buttons
    expect(screen.queryByRole('button', { name: /copy/i })).not.toBeInTheDocument()
  })

  it('renders assistant message with copy button', () => {
    render(
      <Message 
        role="assistant" 
        parts={[mockTextPart]} 
      />
    )
    
    expect(screen.getByText('Hello, this is a test message!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })

  it('shows streaming indicator for last part', () => {
    render(
      <Message 
        role="assistant" 
        parts={[mockTextPart]} 
        isStreaming={true}
      />
    )
    
    expect(screen.getByText('Hello, this is a test message!')).toBeInTheDocument()
    // Streaming indicator (cursor) should be present
  })

  it('handles copy functionality', async () => {
    // Create a fresh mock for this test
    const mockWriteText = jest.fn(() => Promise.resolve())
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    })

    const mockOnCopy = jest.fn()
    const user = userEvent.setup()
    
    render(
      <Message 
        role="assistant" 
        parts={[mockTextPart]} 
        onCopy={mockOnCopy}
      />
    )
    
    const copyButton = screen.getByRole('button', { name: /copy/i })
    await user.click(copyButton)
    
    expect(mockWriteText).toHaveBeenCalledWith('Hello, this is a test message!')
    expect(mockOnCopy).toHaveBeenCalledWith('Hello, this is a test message!')
  })

  it('renders reasoning part with expand/collapse', async () => {
    const user = userEvent.setup()
    render(
      <Message 
        role="assistant" 
        parts={[mockReasoningPart]} 
      />
    )
    
    const reasoningButton = screen.getByRole('button', { name: /reasoning steps/i })
    expect(reasoningButton).toBeInTheDocument()
    
    // Initially collapsed
    expect(screen.queryByText('This is reasoning content...')).not.toBeInTheDocument()
    
    // Expand
    await user.click(reasoningButton)
    expect(screen.getByText('This is reasoning content...')).toBeInTheDocument()
  })

  it('renders chain-of-thought component', () => {
    render(
      <Message 
        role="assistant" 
        parts={[mockChainOfThoughtPart]} 
      />
    )
    
    expect(screen.getByTestId('chain-of-thought')).toBeInTheDocument()
    expect(screen.getByText('AI Reasoning Process')).toBeInTheDocument()
    expect(screen.getByText('1 steps')).toBeInTheDocument()
  })

  it('renders tool call part', () => {
    render(
      <Message 
        role="assistant" 
        parts={[mockToolCallPart]} 
      />
    )
    
    expect(screen.getByText('Calling tool: search_web')).toBeInTheDocument()
    expect(screen.getByText('{"query":"test query"}')).toBeInTheDocument()
  })

  it('renders tool result part', () => {
    render(
      <Message 
        role="assistant" 
        parts={[mockToolResultPart]} 
      />
    )
    
    expect(screen.getByText('Tool result:')).toBeInTheDocument()
    expect(screen.getByText(/test result/)).toBeInTheDocument()
  })

  it('renders source URL part', () => {
    render(
      <Message 
        role="assistant" 
        parts={[mockSourceUrlPart]} 
      />
    )
    
    const link = screen.getByRole('link', { name: /source: https:\/\/example\.com/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders multiple parts correctly', () => {
    render(
      <Message 
        role="assistant" 
        parts={[mockTextPart, mockReasoningPart, mockSourceUrlPart]} 
      />
    )
    
    expect(screen.getByText('Hello, this is a test message!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reasoning steps/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /source:/i })).toBeInTheDocument()
  })

  it('handles system role', () => {
    render(
      <Message 
        role="system" 
        parts={[mockTextPart]} 
      />
    )
    
    expect(screen.getByText('Hello, this is a test message!')).toBeInTheDocument()
  })
})
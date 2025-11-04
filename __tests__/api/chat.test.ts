/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { POST } from '../../app/api/chat/route'

// Mock the HuggingFace API
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('/api/chat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.HUGGINGFACE_API_KEY = 'test-key'
    process.env.HUGGINGFACE_BASE_URL = 'https://api-inference.huggingface.co/v1'
  })

  afterEach(() => {
    delete process.env.HUGGINGFACE_API_KEY
    delete process.env.HUGGINGFACE_BASE_URL
  })

  it('should handle valid chat request', async () => {
    const mockResponse = {
      ok: true,
      headers: new Headers({ 'content-type': 'text/plain; charset=utf-8' }),
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n'))
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
          controller.close()
        }
      })
    }

    mockFetch.mockResolvedValueOnce(mockResponse as any)

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Hello' }
        ],
        model: 'meta-llama/Llama-3.2-1B-Instruct'
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8')
  })

  it('should handle missing API key', async () => {
    delete process.env.HUGGINGFACE_API_KEY

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'meta-llama/Llama-3.2-1B-Instruct'
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(500)
    
    const errorData = await response.json()
    expect(errorData.error).toBe('HuggingFace API key not configured')
  })

  it('should handle invalid request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Missing required fields
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('should handle HuggingFace API error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ error: 'API Error' })
    } as any)

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'meta-llama/Llama-3.2-1B-Instruct'
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(500)
  })

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'meta-llama/Llama-3.2-1B-Instruct'
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(500)
    
    const errorData = await response.json()
    expect(errorData.error).toBe('Failed to process chat request')
  })

  it('should handle tool calls in messages', async () => {
    const mockResponse = {
      ok: true,
      headers: new Headers({ 'content-type': 'text/plain; charset=utf-8' }),
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"choices":[{"delta":{"tool_calls":[{"function":{"name":"search","arguments":"{\\"query\\":\\"test\\"}"}}]}}]}\n\n'))
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
          controller.close()
        }
      })
    }

    mockFetch.mockResolvedValueOnce(mockResponse as any)

    const request = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Search for something' }
        ],
        model: 'meta-llama/Llama-3.2-1B-Instruct',
        tools: [
          {
            type: 'function',
            function: {
              name: 'search',
              description: 'Search the web',
              parameters: {
                type: 'object',
                properties: {
                  query: { type: 'string' }
                }
              }
            }
          }
        ]
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(200)
  })
})
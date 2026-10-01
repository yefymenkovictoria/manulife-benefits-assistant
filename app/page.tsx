'use client';

import { useState } from 'react';

type PlanId = 'health' | 'disability' | 'retirement';

interface PlanInsight {
  label: string;
  value: string;
  detail: string;
}

interface PlanHighlight {
  label: string;
  detail: string;
}

interface PlanDashboard {
  id: PlanId;
  label: string;
  summary: string;
  insights: PlanInsight[];
  highlights: PlanHighlight[];
  questions: string[];
}

interface Message {
  type: 'user' | 'assistant';
  content: string;
}

const planDashboards: PlanDashboard[] = [
  {
    id: 'health',
    label: 'Health',
    summary: 'Medical, dental and vision coverage',
    insights: [
      { label: 'Annual deductible', value: '$250 / $500', detail: 'Individual / family' },
      { label: 'Hospital stays', value: '100%', detail: 'Semi-private room' },
      { label: 'Mental health', value: '10 visits', detail: '80% coverage per year' },
    ],
    highlights: [
      { label: 'Emergency room', detail: '100% covered after a $250 deductible' },
      { label: 'Prescriptions', detail: '80% covered after a $50 annual deductible' },
      { label: 'Vision', detail: '$100 annual allowance for glasses or contacts' },
    ],
    questions: [
      'What is my annual deductible?',
      'What does my vision plan cover?',
      'How much does an emergency room visit cost?',
    ],
  },
  {
    id: 'disability',
    label: 'Disability',
    summary: 'Short-term and long-term income protection',
    insights: [
      { label: 'Short-term maximum', value: '$3,000 / week', detail: 'Up to 26 weeks' },
      { label: 'Income replacement', value: '60%', detail: 'Of eligible salary' },
      { label: 'Waiting period', value: '7 days', detail: 'Short-term disability' },
    ],
    highlights: [
      { label: 'Long-term benefit', detail: 'Up to $6,000 per month to age 65' },
      { label: 'Eligibility', detail: 'Full-time employees after 6 months of service' },
      { label: 'Pre-existing conditions', detail: '90-day lookback applies' },
    ],
    questions: [
      'When do disability payments start?',
      'How long can short-term benefits last?',
      'What are the long-term disability limits?',
    ],
  },
  {
    id: 'retirement',
    label: 'Retirement',
    summary: '401(k) savings and employer matching',
    insights: [
      { label: 'Employer match', value: '50%', detail: 'On your first 6% contributed' },
      { label: 'Eligibility', value: '90 days', detail: 'After employment begins' },
      { label: 'Vesting', value: '3 years', detail: 'For employer matching funds' },
    ],
    highlights: [
      { label: 'Contribution range', detail: '1-15% of gross salary, pre-tax' },
      { label: 'Annual contribution limit', detail: '$23,500 listed in the sample policy' },
      { label: 'Loan options', detail: 'Available after 2 years of participation' },
    ],
    questions: [
      'How does the employer match work?',
      'When can I start contributing?',
      'When do my matching contributions vest?',
    ],
  },
];

export default function BenefitsAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('health');
  const [loading, setLoading] = useState(false);
  const activePlan = planDashboards.find((plan) => plan.id === selectedPlan) ?? planDashboards[0];

  const submitQuestion = async (rawQuestion: string) => {
    const submittedQuestion = rawQuestion.trim();
    if (!submittedQuestion || loading) return;

    setMessages((previous) => [...previous, { type: 'user', content: submittedQuestion }]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: submittedQuestion, selectedPlan }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Failed to get a response');

      setMessages((previous) => [...previous, { type: 'assistant', content: data.answer }]);
    } catch (error) {
      const content = error instanceof Error ? error.message : 'Sorry, something went wrong.';
      setMessages((previous) => [...previous, { type: 'assistant', content }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitQuestion(question);
  };

  return (
    <div className="dashboard-app">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#main" aria-label="Manulife benefits home">
            <span className="brand-mark" aria-hidden="true">M</span>
            <span className="brand-name">manulife</span>
            <span className="brand-divider" />
            <span className="brand-section">Benefits</span>
          </a>
          <div className="topbar-status">
            <span className="status-dot" />
            <span>Sample policy data</span>
          </div>
        </div>
      </header>

      <main id="main" className="dashboard-shell">
        <section className="dashboard-heading" aria-labelledby="dashboard-title">
          <div>
            <p className="eyebrow">BENEFITS OVERVIEW</p>
            <h1 id="dashboard-title">Your coverage, at a glance</h1>
            <p className="dashboard-subtitle">{activePlan.summary}</p>
          </div>
          <div className="plan-switcher" role="group" aria-label="Select a benefits plan">
            {planDashboards.map((plan) => (
              <button
                key={plan.id}
                type="button"
                aria-pressed={selectedPlan === plan.id}
                className={`plan-tab${selectedPlan === plan.id ? ' is-active' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.label}
              </button>
            ))}
          </div>
        </section>

        <div className="dashboard-grid">
          <div className="overview-column">
            <section className="metric-grid" aria-label={`${activePlan.label} plan insights`}>
              {activePlan.insights.map((insight, index) => (
                <article className={`metric-card metric-card-${index + 1}`} key={insight.label}>
                  <p className="metric-label">{insight.label}</p>
                  <p className="metric-value">{insight.value}</p>
                  <p className="metric-detail">{insight.detail}</p>
                </article>
              ))}
            </section>

            <section className="coverage-section" aria-labelledby="coverage-title">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">PLAN DETAILS</p>
                  <h2 id="coverage-title">Coverage highlights</h2>
                </div>
                <span className="source-label">From sample policy</span>
              </div>
              <div className="highlight-list">
                {activePlan.highlights.map((highlight) => (
                  <div className="highlight-row" key={highlight.label}>
                    <span className="highlight-indicator" aria-hidden="true" />
                    <div>
                      <h3>{highlight.label}</h3>
                      <p>{highlight.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="insight-note">
              <span className="note-mark" aria-hidden="true">i</span>
              <p>Plan information is a summary. Check your official benefits documents for full terms and exclusions.</p>
            </div>
          </div>

          <aside className="assistant-panel" aria-label="Benefits assistant">
            <div className="assistant-header">
              <div className="assistant-avatar" aria-hidden="true">M</div>
              <div className="assistant-title">
                <h2>Benefits assistant</h2>
                <p><span className="status-dot" /> Ask about {activePlan.label.toLowerCase()} coverage</p>
              </div>
              <span className="assistant-spark" aria-hidden="true">AI</span>
            </div>

            <div className="chat-messages" aria-live="polite">
              {messages.length === 0 ? (
                <div className="chat-welcome">
                  <p className="welcome-greeting">Hi, how can I help?</p>
                  <p className="welcome-copy">Ask a question or start with one of these.</p>
                  <div className="suggestion-list">
                    {activePlan.questions.map((prompt) => (
                      <button key={prompt} type="button" onClick={() => void submitQuestion(prompt)}>
                        <span>{prompt}</span>
                        <span className="suggestion-arrow" aria-hidden="true">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div className={`message-row message-${message.type}`} key={`${index}-${message.type}`}>
                    <p className="message-label">{message.type === 'user' ? 'You' : 'Assistant'}</p>
                    <div className="message-bubble">{message.content}</div>
                  </div>
                ))
              )}
              {loading && (
                <div className="message-row message-assistant">
                  <p className="message-label">Assistant</p>
                  <div className="message-bubble typing-indicator" aria-label="Assistant is thinking">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </div>

            <form className="chat-form" onSubmit={handleSubmit}>
              <label className="visually-hidden" htmlFor="benefits-question">Ask about your benefits</label>
              <input
                id="benefits-question"
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask about your benefits..."
                disabled={loading}
              />
              <button type="submit" disabled={loading || !question.trim()}>
                Send <span aria-hidden="true">↗</span>
              </button>
            </form>
            <p className="assistant-footnote">Answers are based on the selected sample policy.</p>
          </aside>
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react'
import { AgentPanel } from './components/AgentPanel'
import { Canvas } from './components/Canvas'
import { CreditsAwardedToast } from './components/CreditsAwardedToast'
import { DesignNotesSidebar, ShowNotesTab } from './components/DesignNotes/Sidebar'
import { LeftRail } from './components/LeftRail'
import { LoginScreen } from './components/LoginScreen'
import { OnboardingCoach } from './components/OnboardingCoach'
import { TopStepNav } from './components/PrototypeFrame/TopStepNav'
import { RunBar } from './components/RunBar'
import { StatusBar } from './components/StatusBar'
import { SurveyPopup } from './components/SurveyPopup'
import { TabBar } from './components/TabBar'
import { TemplatesPage } from './components/TemplatesPage'
import { WorkflowToolbar } from './components/WorkflowToolbar'

type Mode = 'login' | 'A' | 'B' | 'C'

export default function App() {
  const [mode, setMode] = useState<Mode>('login')
  const [surveyState, setSurveyState] = useState<
    'popup' | 'modal' | 'awarded' | 'dismissed'
  >('popup')
  const [notesOpen, setNotesOpen] = useState(true)
  /** Flow step currently selected in the AgentPanel — drives node highlight on canvas. */
  const [selectedFlow, setSelectedFlow] = useState<string>('')
  /** Onboarding coach step in State B: 0=character, 1=product, 2=run, -1=dismissed. */
  const [coachStep, setCoachStep] = useState<number>(0)
  /** Which upload modal (if any) is open in the agent panel — lifted so the coach can open it. */
  const [uploadFor, setUploadFor] = useState<'avatar' | 'product' | null>(null)

  const handleModeChange = (m: Mode) => {
    setMode(m)
    if (surveyState === 'dismissed') setSurveyState('popup')
    // Restart the coach whenever we re-enter a Template-loaded mode.
    if (m === 'B' || m === 'C') setCoachStep(0)
  }

  // In State A, no workflow tab is active (the pinned Templates tab handles selection).
  const activeTab = mode === 'A' ? '' : 'gsc_starter_1'
  const workflowName = mode === 'B' || mode === 'C' ? 'gsc_starter_1' : undefined
  const nodeCount = mode === 'B' || mode === 'C' ? 6 : 0

  const stepLabel =
    mode === 'login'
      ? 'Step 1 — Sign in'
      : mode === 'A'
        ? 'Step 2 — Land in editor'
        : mode === 'B'
          ? 'Step 3 — Template loaded · Survey opt-in'
          : 'Step 4 — Template loaded · No agent'

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0c0c0d]">
      <TopStepNav mode={mode} onChange={handleModeChange} />

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-w-0 bg-charcoal-800">
          {mode === 'login' ? (
            <LoginScreen onLogin={() => handleModeChange('A')} />
          ) : (
            <>
              <TabBar
                activeId={activeTab}
                templatesActive={mode === 'A'}
                onOpenTemplates={() => handleModeChange('A')}
                onOpenSurvey={() => {
                  // Re-open the survey from the avatar dropdown after dismiss/auto-collapse
                  setSurveyState('popup')
                }}
              />

              <div className="flex flex-1 min-h-0">
                <LeftRail activeId={mode === 'A' ? 'templates' : undefined} />

                <div className="relative flex-1 min-w-0">
                  {mode === 'A' ? (
                    <TemplatesPage onSelect={() => handleModeChange('B')} />
                  ) : (
                    <>
                      <Canvas showWorkflow={true} selectedFlow={selectedFlow} />
                      <WorkflowToolbar workflowName={workflowName} />
                      <RunBar />
                      <StatusBar nodeCount={nodeCount} />

                      {/* Agent panel only in mode B — mode C hides the entire agent area */}
                      {mode === 'B' && (
                        <AgentPanel
                          onSelectFlow={setSelectedFlow}
                          uploadFor={uploadFor}
                          onUploadForChange={setUploadFor}
                          onCharacterReplaced={() =>
                            setCoachStep((s) => (s === 0 ? 1 : s))
                          }
                          onProductReplaced={() =>
                            setCoachStep((s) => (s === 1 ? 2 : s))
                          }
                          onRunClicked={() =>
                            setCoachStep((s) => (s === 2 ? -1 : s))
                          }
                        />
                      )}

                      <SurveyPopup
                        mode={
                          // Hold the survey back until the onboarding coach has been dismissed.
                          coachStep >= 0
                            ? null
                            : surveyState === 'popup'
                              ? 'invite'
                              : surveyState === 'modal'
                                ? 'survey'
                                : null
                        }
                        onTake={() => setSurveyState('modal')}
                        onDismiss={() => setSurveyState('dismissed')}
                        onComplete={() => setSurveyState('awarded')}
                      />
                      <CreditsAwardedToast
                        show={surveyState === 'awarded'}
                        onDismiss={() => setSurveyState('dismissed')}
                      />
                      <OnboardingCoach
                        step={coachStep}
                        variant={mode === 'C' ? 'canvas' : 'agent'}
                        onAdvance={() =>
                          setCoachStep((s) => (s < 2 ? s + 1 : -1))
                        }
                        onDismiss={() => setCoachStep(-1)}
                        onPrimaryAction={(s) => {
                          if (mode === 'C') {
                            // Canvas variant — every step just advances; final step dismisses.
                            setCoachStep((cur) => (cur < 2 ? cur + 1 : -1))
                            return
                          }
                          // Agent variant — steps 1 & 2 open the matching upload modal.
                          if (s === 0) setUploadFor('avatar')
                          else if (s === 1) setUploadFor('product')
                          else setCoachStep(-1)
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {notesOpen ? (
          <DesignNotesSidebar
            onHide={() => setNotesOpen(false)}
            stepLabel={stepLabel}
            mode={mode}
          />
        ) : (
          <ShowNotesTab onShow={() => setNotesOpen(true)} />
        )}
      </div>
    </div>
  )
}

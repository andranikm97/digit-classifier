import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { CheckmarkIcon, XmarkIcon } from "./components/icons";
import Canvas from "./Canvas";
import { ThreeDotsLoader } from "./components/loaders";
import useEvent from "./hooks/useEvent";

export interface Prediction {
  prediction: string;
  backend_id: string;
}
export default function App(): JSX.Element {
  const canvasRef = useRef<{
    clear: () => void;
  }>();
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const [currentCorrection, setCurrentCorrection] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout>();

  const [correctionContainerShown, setCorrectionContainerShown] =
    useState(false);
  const [thankYouMessageShown, setThankYouMessageShown] = useState(false);
  const showThankYouMessage = () => setThankYouMessageShown(true);
  const hideThankYouMessage = () => setThankYouMessageShown(false);
  const showCorrectionContainer = () => setCorrectionContainerShown(true);
  const hideCorrectionContainer = () => setCorrectionContainerShown(false);
  const handleFeedbackSubmit = (label: string) => {
    canvasRef.current?.clear();
    setCurrentPrediction(null);
    setCurrentCorrection(null);
    fetch(import.meta.env.VITE_SERVER_ENDPOINT + "/train", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        backend_id: currentPrediction.backend_id,
        label,
      }),
    }).then(() => {
      showThankYouMessage();
      timeoutRef.current = setTimeout(() => {
        hideThankYouMessage();
      }, 5000);
    });
  };

  useEvent("clear", (message) => {
    console.log("loud and clear");
  });

  const correctionInputRef = useRef<HTMLInputElement>();
  useEffect(() => {
    if (correctionContainerShown) {
      correctionInputRef.current.focus();
    }
  }, [correctionInputRef.current, correctionContainerShown]);

  return (
    <Main>
      <Wrapper>
        <Side>
          <InstructionsContainer>
            <h1>Instructions</h1>
            <ol>
              <li>
                Draw a <strong>single</strong> digit on the canvas
              </li>
              <li>Hit the "Recognize" button below</li>
              <li>See the prediction on the right</li>
            </ol>
            <p>
              *Help train this neural network by pressing{" "}
              <PositiveFeedbackButton width={30} disabled>
                <CheckmarkIcon fill="white" height={20} />
              </PositiveFeedbackButton>
              or
              <NegativeFeedbackButton width={30} disabled>
                <XmarkIcon fill="white" height={20} />
              </NegativeFeedbackButton>
              .
            </p>
          </InstructionsContainer>
        </Side>

        <Center>
          <Canvas
            ref={canvasRef}
            onPredictionReceived={(data) => {
              setIsLoading(false);
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
              setCurrentPrediction(data);
              hideCorrectionContainer();
              hideThankYouMessage();
            }}
            onCanvasClear={() => {
              setCurrentPrediction(null);
              hideCorrectionContainer();
            }}
            onPredictionRequest={() => setIsLoading(true)}
          />
        </Center>

        <Side>
          {!currentPrediction && thankYouMessageShown && (
            <p>Thanks for your feedback!</p>
          )}
          {(isLoading || currentPrediction) && (
            <PredictionOutputContainer>
              <h1>It's a...</h1>
              {isLoading ? (
                <ThreeDotsLoader fill="#000" />
              ) : (
                <PredictionText>{currentPrediction.prediction}</PredictionText>
              )}
              {!isLoading && !correctionContainerShown && (
                <FeedbackButtonsContainer>
                  <PositiveFeedbackButton
                    onClick={() => {
                      handleFeedbackSubmit(currentPrediction.prediction);
                    }}
                  >
                    <CheckmarkIcon fill="white" height={30} />
                  </PositiveFeedbackButton>
                  <NegativeFeedbackButton
                    onClick={() => {
                      showCorrectionContainer();
                    }}
                  >
                    <XmarkIcon fill="white" height={30} />
                  </NegativeFeedbackButton>
                </FeedbackButtonsContainer>
              )}
              {!isLoading && correctionContainerShown && (
                <CorrectionContainer>
                  <label>Should be:</label>
                  <CorrectionInput
                    ref={correctionInputRef}
                    placeholder="#"
                    maxLength={1}
                    value={currentCorrection}
                    onChange={(e) => {
                      const input = e.target.value;
                      if (input === "" || Number(input)) {
                        setCurrentCorrection(input);
                      }
                    }}
                    onKeyUp={(e) => {
                      if (
                        currentCorrection.length === 1 &&
                        e.code.includes("Digit")
                      ) {
                        setCurrentCorrection(e.code.slice(5));
                      }
                    }}
                  />
                  <PositiveFeedbackButton
                    onClick={() => {
                      setCurrentPrediction(null);
                      hideCorrectionContainer();
                      hideThankYouMessage();
                      handleFeedbackSubmit(currentCorrection);
                    }}
                  >
                    <CheckmarkIcon fill={"white"} height={30} />
                  </PositiveFeedbackButton>
                </CorrectionContainer>
              )}
            </PredictionOutputContainer>
          )}
        </Side>
      </Wrapper>
    </Main>
  );
}

const Main = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  max-height: 789px;
  width: 100%;
  max-width: 1440px;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

const PredictionOutputContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`;

const PredictionText = styled.p`
  font-size: 200px;
  margin: 50px 0px;
`;

const FeedbackButtonsContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
`;

const CorrectionContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

const CorrectionInput = styled.input`
  font-size: 30px;
  width: 50px;
  margin: 0px 10px;
`;

const Side = styled.section`
  flex: 1;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  padding: 0px 10px;
  font-size: 24px;
  margin-top: 50px;
`;

const Center = styled.section`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  height: 100%;
  margin: 0px 20px;
`;

const FeedbackButton = styled.button`
  border: none;
  margin: 0px 10px;
  width: ${(props: { width?: number }) => props.width || 50}px;
  aspect-ratio: 1;
  color: white;
  border-radius: 5px;
  padding: 3px;
  aspect-ratio: 1;
`;
const PositiveFeedbackButton = styled(FeedbackButton)`
  background-color: green;
`;
const NegativeFeedbackButton = styled(FeedbackButton)`
  background-color: red;
`;

const InstructionsContainer = styled.div``;

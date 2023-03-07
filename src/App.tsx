import { useRef, useState } from "react";
import styled from "styled-components";
import { CheckmarkIcon, XmarkIcon } from "./components/icons";
import "./App.css";
import Canvas from "./Canvas";

export interface Prediction {
  prediction: string;
  backend_id: string;
}
export default function App(): JSX.Element {
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(
    null
  );
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const handlePositveFeedback = () => {
    fetch("http://127.0.0.1:5000/train", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        backend_id: currentPrediction.backend_id,
        label: Number(currentPrediction.prediction),
      }),
    }).then(() => {
      setShowThankYouMessage(true);
      timeoutRef.current = setTimeout(() => {
        setShowThankYouMessage(false);
      }, 5000);
    });
  };

  return (
    <div className="App">
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
          onPredictionReceived={(data) => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            setCurrentPrediction(data);
          }}
          onCanvasClear={() => setCurrentPrediction(null)}
        />
      </Center>

      <Side>
        {!currentPrediction && showThankYouMessage && (
          <p>Thanks for your feedback!</p>
        )}
        {currentPrediction && (
          <PredictionOutputContainer>
            <h1>It's a...</h1>
            <PredictionText>{currentPrediction.prediction}</PredictionText>
            <FeedbackButtonsContainer>
              <PositiveFeedbackButton
                onClick={() => {
                  setCurrentPrediction(null);
                  handlePositveFeedback();
                }}
              >
                <CheckmarkIcon fill="white" height={30} />
              </PositiveFeedbackButton>
              <NegativeFeedbackButton id="neg-feedback-btn">
                <XmarkIcon fill="white" height={30} />
              </NegativeFeedbackButton>
            </FeedbackButtonsContainer>
            <CorrectionContainer>
              <label>Should be:</label>
              <CorrectionInput
                id="correction-input"
                placeholder="digit"
                maxLength={1}
              />
              <PositiveFeedbackButton id="pos-feedback-btn-correction">
                <CheckmarkIcon />
              </PositiveFeedbackButton>
            </CorrectionContainer>
          </PredictionOutputContainer>
        )}
      </Side>
    </div>
  );
}

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
  display: none;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

const CorrectionInput = styled.input`
  margin: 0px 5px;
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

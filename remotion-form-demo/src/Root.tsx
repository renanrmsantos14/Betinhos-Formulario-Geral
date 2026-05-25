import "./index.css";
import { Composition } from "remotion";
import { FormDemo } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FormularioGeralDemo"
        component={FormDemo}
        durationInFrames={540}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};

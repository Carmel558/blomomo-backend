import pino, { TransportTargetOptions } from "pino";
import { LOG_TRANSLATE_TIME } from "./resources/logs.resources";

type TCustomProps = {
  context: string;
};

type TPinoConf = {
  pinoHttp: {
    transport: pino.TransportMultiOptions;
    level: string;
    customProps: () => TCustomProps;
  };
};

export class PinoService {
  static createStreams(): TPinoConf {
    const logLevel = "debug" as string;
    const targets: TransportTargetOptions[] = [];
    const pinoConf = {
      pinoHttp: {
        transport: {
          targets,
        },
        level: logLevel,
        customProps: (): TCustomProps => ({
          context: "HTTP",
        }),
      },
    };

    if (logLevel === "debug" || logLevel === "trace") {
      pinoConf.pinoHttp.transport.targets.push({
        target: "pino-pretty",
        options: {
          colorize: true,
          levelFirst: true,
          singleLine: true,
          translateTime: LOG_TRANSLATE_TIME,
        },
      });
    }

    return pinoConf;
  }
}

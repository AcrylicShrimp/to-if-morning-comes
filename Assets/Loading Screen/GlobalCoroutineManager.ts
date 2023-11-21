import { WaitForSeconds } from "UnityEngine";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";

export default class GlobalCoroutineManager extends ZepetoScriptBehaviour {
  // 다른 스크립트에서 이 시스템에 쉽게 접근할 수 있도록 합니다.
  private static instance: GlobalCoroutineManager;

  public static get Instance(): GlobalCoroutineManager {
    return GlobalCoroutineManager.instance;
  }

  Awake() {
    GlobalCoroutineManager.instance = this;
  }

  RunAfter(delay: number, cb: () => void) {
    this.StartCoroutine(this.RunAfterSeconds(delay, cb));
  }

  private *RunAfterSeconds(delay: number, cb: () => void) {
    yield new WaitForSeconds(delay);
    cb();
  }
}

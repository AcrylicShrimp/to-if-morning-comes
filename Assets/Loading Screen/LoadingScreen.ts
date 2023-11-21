import { Animator } from "UnityEngine";
import { ZepetoPlayers } from "ZEPETO.Character.Controller";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";

import GlobalCoroutineManager from "./GlobalCoroutineManager";

export default class LoadingScreen extends ZepetoScriptBehaviour {
  // 다른 스크립트에서 이 시스템에 쉽게 접근할 수 있도록 합니다.
  private static instance: LoadingScreen;

  public static get Instance(): LoadingScreen {
    return LoadingScreen.instance;
  }

  private animator: Animator;

  Awake() {
    LoadingScreen.instance = this;

    this.animator = this.GetComponent<Animator>();
  }

  Start() {
    // 플레이어가 스폰될 때 특정 코드를 실행해달라고 요청합니다.
    ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
      // 플레이어가 스폰되었습니다. 이 월드를 플레이할 준비가 되었으므로, 초기 로딩 스크린을 제거합니다.
      this.Hide();
    });
  }

  // 로딩스크린을 보여줍니다.
  Show() {
    this.gameObject.SetActive(true);
    this.animator.SetTrigger("show");
  }

  // 로딩스크린을 감춥니다.
  Hide() {
    this.animator.SetTrigger("hide");
    // 1초 뒤에 자기 자신을 끕니다. 1초는 애니메이션 길이입니다.
    GlobalCoroutineManager.Instance.RunAfter(1, () => {
      this.gameObject.SetActive(false);
    });
  }
}

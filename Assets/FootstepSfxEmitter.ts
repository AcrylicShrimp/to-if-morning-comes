import { AudioClip, AudioSource, Time } from "UnityEngine";
import {
  CharacterMoveState,
  CharacterState,
  ZepetoPlayers,
} from "ZEPETO.Character.Controller";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";

// 플레이어가 걷거나 뛰고 있을 때 발소리를 내는 스크립트입니다.
export default class FootstepSfxEmitter extends ZepetoScriptBehaviour {
  @SerializeField()
  private intervalWalk: number; // 캐릭터가 걸을 때의 발소리간 시간 간격입니다.
  @SerializeField()
  private intervalRun: number; // 캐릭터가 뛸 때의 발소리간 시간 간격입니다.
  @SerializeField()
  private clip: AudioClip; // 발소리 효과음입니다.
  @SerializeField()
  private volume: number; // 발소리 크기입니다.
  private source: AudioSource; // 발소리를 낼 컴포넌트입니다. 자동으로 생성됩니다.

  private interval: number; // 사용할 발소리간 시간 간격입니다. 0보다 작으면 소리를 내지 않습니다.
  private lastTime: number; // 마지막으로 소리를 낸 시점입니다.

  // 초기화된 직후 최초 한번 유니티에서 자동으로 실행해줍니다.
  Awake() {
    this.interval = -1;
    this.lastTime = 0;
  }

  // `Awake` 이후에 해당 객체가 활성화되면 최초 한번 유니티에서 자동으로 호출해줍니다.
  Start() {
    // 플레이어가 스폰될 때 특정 코드를 실행해달라고 요청합니다.
    ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
      // 플레이어가 스폰되었습니다.
      const player = ZepetoPlayers.instance.LocalPlayer;

      // 플레이어 객체 내에 발소리를 내는 컴포넌트를 부착합니다.
      this.source =
        player.zepetoPlayer.character.gameObject.AddComponent<AudioSource>();

      // 플레이어의 상태가 변할 때 알려달라고 요청합니다.
      player.zepetoPlayer.character.OnUpdateState.AddListener(
        this.OnLocalCharacterChangedState.bind(this)
      );
    });
  }

  // 매 프레임 유니티에서 자동으로 실행해줍니다.
  Update() {
    // 발소리를 낼 상황이 아니면 아무 것도 하지 않습니다. (예: 캐릭터가 가만히 서 있음, 점프 중임 등)
    if (this.interval < 0) return;

    // 현재 시간을 가져옵니다.
    const now = Time.timeSinceLevelLoadAsDouble;

    // 마지막으로 소리를 낸 시점과 비교해서 충분히 시간이 지나지 않았으면 아무 것도 하지 않습니다.
    if (now - this.lastTime < this.interval) return;

    this.source.PlayOneShot(this.clip, this.volume); // 소리를 냅니다.
    this.lastTime = now; // 마지막으로 소리를 낸 시점을 현재 시간으로 맞춰줍니다.
  }

  // 캐릭터의 상태가 변하면 호출됩니다.
  OnLocalCharacterChangedState(to: CharacterState) {
    if (to === CharacterState.Move) {
      const player = ZepetoPlayers.instance.LocalPlayer;
      const moveState =
        player.zepetoPlayer.character.motionState.currentMoveState;

      if (moveState === CharacterMoveState.MoveWalk) to = CharacterState.Walk;
      else if (moveState === CharacterMoveState.MoveRun)
        to = CharacterState.Run;
    }

    // 캐릭터가 걷고 있다면 걷는 상태의 발소리 시간 간격을 사용합니다.
    if (to === CharacterState.Walk) this.interval = this.intervalWalk;
    // 캐릭터가 뛰고 있다면 뛰는 상태의 발소리 시간 간격을 사용합니다.
    else if (to === CharacterState.Run) this.interval = this.intervalRun;
    else this.interval = -1; // 둘 다 아니라면 발소리를 내지 않도록 설정합니다.
  }
}

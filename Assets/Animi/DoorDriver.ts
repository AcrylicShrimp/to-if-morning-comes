import { Animator, Collider } from "UnityEngine";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";

// 문의 움직임을 제어하는 스크립트 입니다.
export default class DoorDriver extends ZepetoScriptBehaviour {
  @SerializeField() // 유니티 에디터에 해당 프로퍼티를 노출하라는 지시어입니다.
  private animator: Animator; // 재생할 문 애니메이션을 관리하는 컴포넌트입니다: https://docs.unity3d.com/kr/current/Manual/class-Animator.html

  // 이 `OnTriggerEnter` 함수는 트리거 (에디터에서 콜라이더로 설정한) 영역 내에 다른 물체가 들어왔을 경우 호출됩니다. 유니티에서 자동으로 호출해줍니다.
  // 괄호 안에 있는 `collider: Collider`라는 표현은 영역 내에 들어온 물체를 가리킵니다. 이는 유니티에서 정해둔 것이며,
  // 개발자가 원하는 동작을 편하게 구현할 수 있도록 유니티에서 제공해주는 값입니다. 이러한 유니티의 기능에 대한 자세한 정보는 여기를 참조하세요: https://docs.unity3d.com/ScriptReference/Collider.OnTriggerEnter.html
  // `: Collider`는 `collider`의 타입을 나타냅니다. 이 타입에 대한 자세한 정보는 여기를 참조하세요: https://docs.unity3d.com/ScriptReference/Collider.html
  OnTriggerEnter(collider: Collider) {
    // 접근한 개체가 플레이어인지 확인합니다. 아니면 처리할 필요가 없으므로 무시합니다.
    // 왜 "Player"일까요? 플레이어가 스폰되면 해당 태그를 갖도록 제가 설정했기 때문입니다. `CharacterController` 스크립트를 참조하세요.
    if (!collider.CompareTag("Player")) return;

    // 플레이어가 문에 접근했으므로 문을 열어줍니다.
    // "open"이라는 이름의 트리거를 켜줍니다. 왜 "open"일까요? 에디터에서 애니메이션 컨트롤러 에셋을 만들 때 제가 그렇게 설정했기 때문입니다.
    // 자세히 알아보려면 유니티 에디터에서 애니메이션 컨트롤러 에셋을 확인해보세요.
    this.animator.SetTrigger("open");
  }

  // 위와 마찬가지로 영역 내에서 누군가 빠져나갈 때 호출됩니다. 자세한 정보는 여기를 참조하세요: https://docs.unity3d.com/ScriptReference/Collider.OnTriggerExit.html
  OnTriggerExit(collider: Collider) {
    // 멀어진 개체가 플레이어인지 확인합니다. 아니면 처리할 필요가 없으므로 무시합니다.
    if (!collider.CompareTag("Player")) return;

    // 플레이어가 문에서 떨어졌으므로 문을 닫아줍니다.
    this.animator.SetTrigger("close");
  }
}

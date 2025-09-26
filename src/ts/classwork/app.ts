import Subject from "./Subject";
import { timer, clickBtn, trackInput, getUser, FioInput } from "./GPTtasks";

// Subject теперь типизирован как Subject<string>, так как он передает строки (значения из input)
const emailSubject = new Subject<string>();

const email = document.querySelector(".input") as HTMLInputElement;

email.addEventListener("input", (event) => {
  const target = event.target as HTMLInputElement | null;
  // next() теперь ожидает string, что соответствует target?.value ?? ""
  emailSubject.next(target?.value ?? "");
});

// updateHello теперь принимает только string | null, что соответствует типизации
function updateHello(value: string | null) {
  const hello = document.querySelector(".hello") as HTMLHeadingElement;
  if (value === "" || value === null) {
    hello.textContent = "Привет, Guest";
  } else {
    hello.textContent = "Привет, " + value;
  }
}

// subscribe теперь ожидает (value: string) => void.
// В вашем коде updateHello принимает (value: string | null),
// но next() передает "" (string) или target?.value (string),
// поэтому для строгой совместимости лучше изменить сигнатуру updateHello,
// если next() не будет передавать null, или оставить как есть, если линтер на это не ругается
// (так как "" будет передано вместо null в next)
emailSubject.subscribe(updateHello);

timer();
clickBtn();
trackInput();
getUser();
FioInput();

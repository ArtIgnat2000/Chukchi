const navLinks=[...document.querySelectorAll('nav a')];
const chapters=[...document.querySelectorAll('.chapter')];
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id));}})},{rootMargin:'-35% 0px -55%'});
chapters.forEach(section=>observer.observe(section));

// Режим репетиции: выделяем по одному предложению.
document.querySelectorAll('.say-button').forEach(button=>{
  let current=-1;
  button.addEventListener('click',()=>{
    const list=button.previousElementSibling;
    const lines=[...list.children];
    current=(current+1)%(lines.length+1);
    list.classList.toggle('presenting',current<lines.length);
    lines.forEach((line,i)=>line.classList.toggle('current',i===current));
    if(current<lines.length){button.textContent=`Предложение ${current+1} из ${lines.length} →`;lines[current].scrollIntoView({behavior:'smooth',block:'center'});}
    else{button.textContent='▶ Начать рассказ заново';}
  });
});

const traditionText={
  star:['Пэгытти','Название связывают с появлением на небе звезды Альтаир. Для оленеводов это знак наступления нового сезонного цикла.'],
  whale:['Праздник кита','Береговые жители благодарят море за пищу и удачную охоту. Праздник напоминает, что к природе нужно относиться бережно.'],
  drum:['Танец и бубен','Танцы рассказывают без слов: движениями изображают птиц, оленей и сцены охоты. Ритм задаёт круглый бубен.']
};
const detail=document.getElementById('tradDetail');
document.querySelectorAll('.trad-card').forEach(card=>card.addEventListener('click',()=>{
  document.querySelectorAll('.trad-card').forEach(c=>c.classList.remove('active'));card.classList.add('active');
  const [title,text]=traditionText[card.dataset.trad];detail.innerHTML=`<b>${title}</b><p>${text}</p>`;
}));

const questions=[
  {q:'Как называется переносной дом чукотских оленеводов?',a:['Иглу','Яранга','Чумга'],c:1,why:'Яранга — разборное жилище с каркасом, покрытым шкурами.'},
  {q:'Из чего традиционно шьют кухлянку?',a:['Из оленьего меха','Из хлопка','Из соломы'],c:0,why:'Олений мех хорошо удерживает тепло и защищает от ветра.'},
  {q:'Что сопровождает традиционные танцы?',a:['Скрипка','Бубен','Балалайка'],c:1,why:'Ритм танцам задаёт бубен.'},
  {q:'Какая пища была основой традиционной кухни?',a:['Рис и фрукты','Оленина и рыба','Хлеб и сыр'],c:1,why:'Оленина, рыба и морская добыча давали энергию в холоде.'},
  {q:'Что означает самоназвание «лыгъоравэтльан»?',a:['Настоящие люди','Люди гор','Хранители огня'],c:0,why:'Обычно это самоназвание переводят как «настоящие люди».'}
];
let qIndex=0,score=0,locked=false;
const quizBox=document.getElementById('quizBox');
const scoreBox=document.getElementById('score');
function stars(){scoreBox.textContent='★'.repeat(score)+'☆'.repeat(5-score)}
function renderQuestion(){
  locked=false;
  if(qIndex===questions.length){quizBox.innerHTML=`<div class="quiz-progress">Готово!</div><h4>${score===5?'Отлично! Все пять ответов верные.':'Твой результат: '+score+' из 5'}</h4><p>${score>=4?'Ты отлично познакомился с культурой чукчей!':'Можно заглянуть в рассказы ещё раз и улучшить результат.'}</p><button class="next-q" id="restart">Пройти ещё раз</button>`;document.getElementById('restart').onclick=()=>{qIndex=0;score=0;stars();renderQuestion()};return;
  }
  const item=questions[qIndex];
  quizBox.innerHTML=`<div class="quiz-progress">Вопрос ${qIndex+1} из ${questions.length}</div><h4>${item.q}</h4><div class="answers">${item.a.map((text,i)=>`<button type="button" data-answer="${i}">${text}</button>`).join('')}</div><div class="feedback" aria-live="polite"></div>`;
  quizBox.querySelectorAll('[data-answer]').forEach(button=>button.onclick=()=>answer(Number(button.dataset.answer)));
}
function answer(choice){
  if(locked)return;locked=true;const item=questions[qIndex];const buttons=[...quizBox.querySelectorAll('[data-answer]')];
  buttons[item.c].classList.add('correct');if(choice===item.c)score++;else buttons[choice].classList.add('wrong');stars();
  const feedback=quizBox.querySelector('.feedback');feedback.innerHTML=`${choice===item.c?'Верно!':'Почти!'} ${item.why} <button class="next-q" type="button">${qIndex===4?'Узнать результат':'Следующий вопрос'} →</button>`;
  feedback.querySelector('button').onclick=()=>{qIndex++;renderQuestion()};
}
stars();renderQuestion();

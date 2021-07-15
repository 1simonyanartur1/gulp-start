# Сборка --- версия 11.07.2021

## Начало работы
В системе должен быть установлен [Node.js и npm](https://nodejs.org/en/ "Ссылка на сайт Node.js").
1. Скопировать себе сборку любым удобным [способом](http://example.com/ "Перейти к способам копирования проекта").
2. Открыть сборку в любимом редакторе кода.
3. Установить необходимые пакеты для работы сборки командой __npm i__.
4. В файле __README.md__ можно все удалить и оставить заголовок такого типа __#Название_проекта__ или оставить данную инструкцию.
5. В файле __package.json__ изменить значения: __"name"__ - название проэкта и __"author"__ - автор проекта.
6. В файле gulpfile.js убрать из подключения не нужные библиотеки, строки: __48__ и __59__, там же подключить нужные.
7. Можно начинать работать
8. По окончанию работы необходимо создать наш продакшен, папку __prod__, командой __gulp build__.
## Code style:
1. [JS](https://github.com/airbnb/javascript)
2. [CSS\SASS](https://github.com/rtplv/airbnb-css-ru)
## Команды:
* __gulp__ - запускает сборку
* __gulp csslibs__ - формирование файла с плагинами libs.min.css
* __gulp jslibs__ - формирование файла с плагинами libs.min.js
* __gulp clearapp__ - удалить папку app
* __gulp clearprod__ - удалить папку prod
* __gulp build__ - формирование папки продакшена (prod)
* __gulp имя_таска__ - запустит конкретный таск. Например компиляция Pug в HTML
## Описание директорий
1. __src/__ - Тут происходит вся работа
	1. __/assets/__ - Содержит шрифты и вспомогательные библиотеки
	2. __/layout/__ - Страницы/шаблоны сайта
2. __prod/__ - Готовые файлы проекта
3. __app/__ - Отражение папки prod, не минифицированные стили и скрипты
4. __/pages/__ - Шаблоны страниц
5. __/components/__ - Содержит в себе pug и scss компоненты.
6. __/common/__ - Общие картинки, скрипты и стили
7. __/blocks/__ - Блоки сайта
## Создание нового блока\секции
В папке __/layout/__ находим папку __/blocks/__ и внутри ее создаем новую папку с названием нашей секции. Cтруктуру файлов и папок внутри можно посмотреть на примере папки __/header/__. Каждый блок в pug разметке делать миксином. __PUG__ файлы подключать в /layout/sections.pug. __SASS__ файлы подключать в /common/common.scss. __JS__ файлы подключать в /common/common.js. 

Файл __/layout/layout.pug__ - это общая разметка для каждой страницы.
## Создание SVG спрайта
Спрайт создается автоматически при запуске и во время работы сборки, если добавить svg-иконки в __src/layout/common/img/icons/svg/__.
## Создание PNG спрайта
Спрайт создается автоматически при запуске и во время работы сборки, если добавить png-иконки в __src/layout/common/img/icons/png/__.
Иконки для ретины в конце имени должны иметь __-2x__ и быть по высоте и ширине ровно в 2 раза больше, иначе плагин выдает ошибку.
## Полезные плагины JS
* __[imask](https://imask.js.org/)__ - маски ввода
* __[Inputmask](https://github.com/RobinHerbots/Inputmask)__ - маски ввода
* __[swiper](https://swiperjs.com/get-started)__ - слайдер
* __[tingle](https://tingle.robinparisi.com/)__ - модальные окна
* __[nouislider](https://refreshless.com/nouislider/)__ - плагин ползунка выбора цены и т.д.
* __[spotlight](https://github.com/nextapps-de/spotlight)__ - галлерея изображений
* __[glightbox](https://biati-digital.github.io/glightbox/)__ - галлерея изображений
## Полезные плагины jQuery
* __[slick](https://kenwheeler.github.io/slick/)__ - слайдер
* __[fancybox](https://fancyapps.com/fancybox/3/)__ - галлерея изображений
* __[magnific-popup](https://dimsemenov.com/plugins/magnific-popup/)__ - модальные окна
* __[smartmenus](https://www.smartmenus.org/)__ - многоуровневое меню
* __[stellarnav](https://github.com/vinnymoreira/stellarnav)__ - многоуровневое меню
* __[aos](https://michalsnik.github.io/aos/)__ - плагин анимаций
* __[niceselect](https://jqueryniceselect.hernansartorio.com/)__ - кастомизация select
* __[twentytwenty](https://github.com/zurb/twentytwenty)__ - плагин сравнения 2х картинок
* __[ion.rangeSlider](http://ionden.com/a/plugins/ion.rangeSlider/)__ - плагин ползунка выбора цены и т.д.

## Дополнительная информация
* [GULP](https://gulpjs.com/)
* [NPM пакеты](https://www.npmjs.com/)
* [NPM команды](https://v3c.ru/soft/komandy-npm)
* [GIT](https://git-scm.com/book/ru/v2)
* [PUG](https://pugjs.org/api/getting-started.html)
* [SASS](https://sass-scss.ru/)

## VS Code
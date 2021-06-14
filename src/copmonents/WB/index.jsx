import React, { Component } from 'react'
import io from "socket.io-client";
import { saveBoardNametoLocalStorage } from './helper.js';
import { ReactComponent as CircleIcon } from "../../assets/icons/circle.svg";

export default class index extends Component {
  componentDidMount(){
    var translations = {
      "de": {
        "board_name_placeholder": "Name des Whiteboards…",
        "circle": "Kreis",
        "click_to_toggle": "Klicken Sie zum Umschalten",
        "click_to_zoom": "Klicke zum reinzoomen\nHalte die Umschalttaste und klicke zum herauszoomen",
        "collaborative_whiteboard": "Kollaboratives Whiteboard",
        "color": "Farbe",
        "configuration": "Konfiguration",
        "create_private_board": "Erstelle ein privates Whiteboard",
        "ellipse": "Ellipse",
        "eraser": "Radierer",
        "grid": "Gitter",
        "hand": "Hand",
        "index_title": "Wilkommen bei WBO!",
        "introduction_paragraph": "WBO ist ein <a href=\"https://github.com/lovasoa/whitebophir\" title=\"Frei im Sinne von Redefreiheit, nicht Freibier. Diese Software wird unter der AGPL Lizenz veröffentlicht.\">freies und quelloffenes</a> kollaboratives Online-Whiteboard das vielen Nutzern erlaubt gleichzeitig auf einem großen virtuellen Whiteboard zu zeichnen. Das Whiteboard wird in Echtzeit für alle Nutzer aktualisiert und sein Inhalt wird gespeichert. Es kann für verschiedenste Anwendungen genutzt werden, z.B. Kunst, Unterhaltung, Design, Unterricht und Lehre.",
        "keyboard_shortcut": "Tastenkombination",
        "loading": "Lädt",
        "menu": "Menü",
        "mousewheel": "Mausrad",
        "mover": "Verschiebung",
        "named_private_board_description": "Du kannst auch ein <strong>privates Whiteboard mit Namen</strong> mit einer benutzerdefinierten URL erstellen. Alle die den Namen kennen, können darauf zugreifen.",
        "opacity": "Deckkraft",
        "open_public_board": "Gehe zum öffentlichen Whiteboard",
        "pencil": "Stift",
        "private_board_description": "Du kannst ein <b>privates Whiteboard</b> mit einem zufälligen Namen erstellen, welches man nur mit seinem Link öffnen kann. Benutze dies wenn du private Informationen teilen möchtest.",
        "public_board_description": " Das <b>öffentliche Whiteboard</b> kann von jedem geöffnet werden. Es ein fröhliches unorganisiertes Chaos wo du zusammen mit anonymen Fremden malen kannst. Alles dort ist vergänglich.",
        "recent_boards": "Neueste Whiteboards",
        "rectangle": "Rechteck",
        "share_instructions": "Um mit jemanden zusammen an einem Whiteboard zu arbeiten teile einfach die jeweilige URL.",
        "size": "Größe",
        "square": "Quadrat",
        "straight_line": "Gerade Linie",
        "tagline": "Ein freies quelloffenes kollaboratives Zeichentool. Zeichnet eure Ideen zusammen auf WBO!",
        "text": "Text",
        "tools": "Werkzeuge",
        "view_source": "Quellcode auf GitHub",
        "white-out": "Korrekturflüssigkeit",
        "zoom": "Zoom"
      },
      "en": {
        "White-out": "White-out",
        "board_name_placeholder": "Name of the board…",
        "circle": "Circle",
        "click_to_toggle": "click to toggle",
        "click_to_zoom": "Click to zoom in\nPress shift and click to zoom out",
        "collaborative_whiteboard": "Collaborative whiteboard",
        "color": "Color",
        "configuration": "Configuration",
        "create_private_board": "Create a private board",
        "ellipse": "Ellipse",
        "eraser": "Eraser",
        "grid": "Grid",
        "hand": "Hand",
        "index_title": "Welcome to the free online whiteboard WBO!",
        "introduction_paragraph": "WBO is a <a href=\"https://github.com/lovasoa/whitebophir\" title=\"Free as in free speech, not free beer. This software is released under the AGPL license\">free and open-source</a> online collaborative whiteboard that allows many users to draw simultaneously on a large virtual board. The board is updated in real time for all connected users, and its state is always persisted. It can be used for many different purposes, including art, entertainment, design and teaching.",
        "keyboard_shortcut": "keyboard shortcut",
        "loading": "Loading",
        "menu": "Menu",
        "mousewheel": "mouse wheel",
        "mover": "Mover",
        "named_private_board_description": "You can also create a <strong>named private board</strong>, with a custom URL, that will be accessible to all those who know its name.",
        "opacity": "Opacity",
        "open_public_board": "Go to the public board",
        "pencil": "Pencil",
        "private_board_description": "You can create a <b>private board</b> with a random name, that will be accessible only by its link. Use this if you want to share private information.",
        "public_board_description": "The <b>public board</b> is accessible to everyone. It is a happily disorganized mess where you can meet with anonymous strangers and draw together. Everything there is ephemeral.",
        "recent_boards": "Recent Boards",
        "rectangle": "Rectangle",
        "share_instructions": "To collaborate on a drawing in real time with someone, just send them its URL.",
        "size": "Size",
        "square": "Square",
        "straight_line": "Straight line",
        "tagline": "A free and open-source online collaborative drawing tool. Sketch new ideas together on WBO!",
        "text": "Text",
        "tools": "Tools",
        "view_source": "Source code on GitHub",
        "zoom": "Zoom"
      },
      "es": {
        "board_name_placeholder": "Nombre de la pizarra …",
        "circle": "Círculo",
        "click_to_toggle": "haga clic para alternar",
        "click_to_zoom": "Haga clic para acercar, Pulse [Mayús] y haga clic para alejar",
        "collaborative_whiteboard": "Pizarra colaborativa",
        "color": "Color",
        "configuration": "Configuration",
        "create_private_board": "Crea una pizarra privada",
        "ellipse": "Elipse",
        "eraser": "Borrador",
        "grid": "Cuadrícula",
        "hand": "Mano",
        "index_title": "¡Bienvenido a WBO!",
        "introduction_paragraph": "WBO es una pizarra colaborativa en línea, <a href=\"https://github.com/lovasoa/whitebophir\" title=\"libre como la libertad de expresión, no libre como una cerveza gratis. Este software se lanza bajo la licencia AGPL\">libre y de Código abierto</a>, que permite a muchos usuarios dibujar simultáneamente en una gran pizarra virtual. La pizarra se actualiza en tiempo real para todos los usuarios conectados y su estado siempre es persistente. Se puede utilizar para muchos propósitos diferentes, incluyendo arte, entretenimiento, diseño y enseñanza.",
        "keyboard_shortcut": "atajo de teclado",
        "loading": "Cargando",
        "menu": "Menú",
        "mousewheel": "Rueda del Ratón",
        "mover": "Desplazamiento",
        "named_private_board_description": "También puede crear una <strong>pizarra privada dándole un nombre aleatorio o un nombre especifico</strong>, una <abbr title=\"tipo: https://wbo.ophir.dev/boards/el-código-que-te-parezca\">URL personalizada</abbr>, que será accesible para todos aquellos que conozcan su nombre.",
        "opacity": "Opacidad",
        "open_public_board": "Ir a la pizarra pública",
        "pencil": "Lápiz",
        "private_board_description": "Puede crear una <b>pizarra privada</b> con un nombre aleatorio, al que solo se podrá acceder mediante su enlace. Úselo si desea compartir información privada.",
        "public_board_description": "La <b>pizarra pública</b> es accesible para todos. Es un desastre felizmente desorganizado donde puedes reunirte con extraños anónimos. Todo lo que hay es efímero.",
        "recent_boards": "Pizarras recientes",
        "rectangle": "Rectángulo",
        "share_instructions": "Para colaborar en un dibujo en tiempo real con alguien, simplemente envíele la <abbr title=\"un enlace tipo: https://wbo.ophir.dev/boards/el-codigo-de-tu-pizarra\">URL</abbr> de la pizarra que ya creaste.",
        "size": "Tamaño",
        "square": "Cuadrado",
        "straight_line": "Línea recta",
        "tagline": "Una herramienta de dibujo colaborativa en línea gratuita y de código abierto. Esboce nuevas ideas en la pizarra colaborativa WBO !",
        "text": "Texto",
        "tools": "Herramientas",
        "view_source": "Código fuente en GitHub",
        "white-out": "Blanqueado",
        "zoom": "Zoom"
      },
      "fr": {
        "board_name_placeholder": "Nom du tableau…",
        "circle": "Cercle",
        "click_to_toggle": "cliquer pour changer",
        "click_to_zoom": "Cliquez pour zoomer\nCliquez en maintenant la touche majuscule enfoncée pour dézoomer",
        "collaborative_whiteboard": "Tableau blanc collaboratif",
        "color": "Couleur",
        "create_private_board": "Créer un tableau privé",
        "ellipse": "Ellipse",
        "eraser": "Gomme",
        "grid": "Grille",
        "hand": "Main",
        "index_title": "Bienvenue sur le tableau blanc collaboratif WBO !",
        "introduction_paragraph": "WBO est un logiciel <a href=\"https://github.com/lovasoa/whitebophir\" title=\"voir le code sous license AGPL\">libre et gratuit</a> de dessin collaboratif en ligne qui permet à plusieurs utilisateurs de collaborer simultanément sur un tableau blanc. Le tableau est mis à jour en temps réel pour tous les utilisateurs connectés, et reste disponible après votre déconnexion. Il peut être utilisé notamment pour l'enseignement, l'art, le design ou juste pour s'amuser.",
        "keyboard_shortcut": "raccourci clavier",
        "loading": "Chargement",
        "menu": "Menu",
        "mousewheel": "molette de la souris",
        "mover": "Déplacer un élément",
        "named_private_board_description": "Vous pouvez aussi créer un <strong>tableau privé nommé</strong>, avec une adresse personnalisée, accessible à tous ceux qui en connaissent le nom.",
        "opacity": "Opacité",
        "open_public_board": "Ouvrir le tableau anonyme",
        "pencil": "Crayon",
        "private_board_description": "Vous pouvez créer un <b>tableau privé</b> dont le nom sera aléatoire. Il sera accessible uniquement à ceux avec qui vous partagerez son adresse. À utiliser lorsque vous voulez partager des informations confidentielles.",
        "public_board_description": "Le <b>tableau anonyme</b> est accessible publiquement. C'est un joyeux bazar où vous pourrez rencontrer des étrangers anonymes, et dessiner avec eux. Tout ce que vous y inscrivez est éphémère.",
        "recent_boards": "Tableaux récents",
        "rectangle": "Rectangle",
        "share_instructions": "Pour collaborer sur un tableau avec quelqu'un, envoyez-lui simplement son URL.",
        "size": "Taille",
        "square": "Carré",
        "straight_line": "Ligne droite",
        "tagline": "Logiciel libre pour collaborer en ligne sur un tableau blanc. Venez dessiner vos idées ensemble sur WBO !",
        "text": "Texte",
        "tools": "Outils",
        "view_source": "Code source sur GitHub",
        "white-out": "Blanco"
      },
      "hu": {
        "White-out": "Lefedő",
        "board_name_placeholder": "Tábla neve…",
        "circle": "Kör",
        "click_to_toggle": "kattintson ide a be- és kikapcsolásához",
        "click_to_zoom": "Kattintson ide a nagyításhoz.\nShift + kattintás a kicsinyítéshez",
        "collaborative_whiteboard": "Együttműködési tábla",
        "color": "Szín",
        "configuration": "Beállítások",
        "create_private_board": "Saját tábla létrehozása",
        "ellipse": "Ellipszis",
        "eraser": "Radír",
        "grid": "Rács",
        "hand": "Kéz",
        "index_title": "Isten hozta a WBO ingyenes online tábláján!",
        "introduction_paragraph": "A WBO egy <a href=\"https://github.com/lovasoa/whitebophir\" title=\"Ingyenes, mint a szabad beszédben, nem ingyenes sör. Ez a szoftver a AGPL licenc alapján kerül kiadásra.\">ingyenes és nyílt forráskódú</a> online együttműködési tábla, amely lehetővé teszi sok felhasználó számára, hogy egyidejűleg rajzoljon egy nagy virtuális táblán. Az alaplap valós időben frissül az összes csatlakoztatott felhasználó számára és állapota állandó. Különböző célokra felhasználható, beleértve a művészetet, a szórakoztatást, a tervezést és a tanítást.",
        "keyboard_shortcut": "billentyűparancs",
        "loading": "Betöltés folyamatban",
        "menu": "Menü",
        "mousewheel": "egérkerék",
        "mover": "Mozgató",
        "named_private_board_description": "Készíthet egy <strong>saját nevű táblát</strong> is, egyéni URL-címmel, amely mindenki számára elérhető, aki ismeri a nevét.",
        "opacity": "Átlátszatlanság",
        "open_public_board": "Nyilvános tábla megnyitása",
        "pencil": "Ceruza",
        "private_board_description": "Készíthet egy <b>saját táblát</b> véletlenszerű névvel, amely csak a linkjével lesz elérhető. Használja ezt, ha személyes adatokat szeretne megosztani.",
        "public_board_description": "A <b>nyilvános tábla</b> mindenki számára elérhető. Ez egy boldog szervezetlen rendetlenség, ahol találkozhat a névtelen ismeretlenek és dolgozhat együtt. Minden ott rövid távú.",
        "recent_boards": "Recent Boards",
        "rectangle": "Téglalap",
        "share_instructions": "Ha valakivel valós időben szeretne együttműködni egy rajzon, küldje el neki az URL-jét.",
        "size": "Méret",
        "square": "Négyzet",
        "straight_line": "Egyenes vonal",
        "tagline": "Ingyenes és nyílt forráskódú online együttműködési rajzoló eszköz. Vázoljon fel új ötleteket a WBO-n!",
        "text": "Szöveg",
        "tools": "Eszközök",
        "view_source": "Forráskód a GitHub-on",
        "zoom": "Nagyítás/kicsinyítés"
      },
      "it": {
        "board_name_placeholder": "Nome della lavagna…",
        "circle": "Cerchio",
        "click_to_toggle": "Fai Clic per attivare",
        "click_to_zoom": "Fai clic per ingrandire \nPremi [MAIUSC] e fai clic per ridurre",
        "collaborative_whiteboard": "Lavagna collaborativa",
        "color": "Colore",
        "configuration": "Configurazione",
        "create_private_board": "Crea una lavagna privata",
        "ellipse": "Ellisse",
        "eraser": "Gomma",
        "grid": "Griglia",
        "hand": "Mano",
        "index_title": "Benvenuti a WBO!",
        "introduction_paragraph": "WBO è una lavagna collaborativa online <a href=\"https://github.com/lovasoa/whitebophir\" title=\"gratuita come é gratuita la libertà di espressione, no come un boccale di birra gratis. Questo software è rilasciato sotto licenza AGPL\">gratuita e open source</a> che consente a molti utenti di disegnare contemporaneamente su una grande lavagna virtuale. La lavagna viene aggiornata in tempo reale per tutti gli utenti connessi e lo stato è sempre persistente. Può essere utilizzato per molti scopi diversi, tra cui arte, intrattenimento, design e insegnamento.",
        "keyboard_shortcut": "scorciatoia da tastiera",
        "loading": "Caricamento in corso",
        "menu": "Menu",
        "mousewheel": "rotella del mouse",
        "mover": "Spostamento",
        "named_private_board_description": "Puoi anche creare una <strong>lavagna privata con un nome creato da te</strong>, con un URL personalizzato, che sarà accessibile a tutti coloro che ne conoscono il nome.",
        "opacity": "Opacità",
        "open_public_board": "Vai alla lavagna pubblica",
        "pencil": "Matita",
        "private_board_description": "Puoi creare una <b>lavagna privata</b> con un nome casuale, che sarà accessibile solo dal suo URL. Usalo se vuoi condividere informazioni private.",
        "public_board_description": "La <b>lavagna pubblica</b> è accessibile a tutti. È un disastro felicemente disorganizzato dove puoi incontrare sconosciuti anonimi e disegnare insieme. Tutto in questo spazio è effimero.",
        "recent_boards": "Lavagne recenti",
        "rectangle": "Rettangolo",
        "share_instructions": "Per collaborare a un disegno in tempo reale con qualcuno, basta condividere l'<abbr title=\"un link tipo https://wbo.ophir.dev/boards/il-codice-della-tua-lavagna\">URL della lavagna</abbr>.",
        "size": "Dimensione",
        "square": "Quadrato",
        "straight_line": "Linea retta",
        "tagline": "Uno strumento collaborativo per disegnare online, gratuito e open source. Disegniamo insieme nuove idee su WBO!",
        "text": "Testo",
        "tools": "Strumenti",
        "view_source": "Codice sorgente su GitHub",
        "white-out": "Bianchetto",
        "zoom": "Zoom"
      },
      "ja": {
        "board_name_placeholder": "ボードの名前",
        "circle": "サークル",
        "click_to_toggle": "クリックして切り替えます",
        "click_to_zoom": "クリックで拡大\nシフトを押しながらクリックで縮小",
        "collaborative_whiteboard": "協同作業できるオンラインホワイトボード",
        "color": "色",
        "configuration": "設定",
        "create_private_board": "プライベートボードを作成する",
        "ellipse": "楕円",
        "eraser": "消去",
        "grid": "グリッド",
        "hand": "手のひらツール",
        "index_title": "WBOへようこそ!",
        "introduction_paragraph": "WBOは<a href=\"https://github.com/lovasoa/whitebophir\" title=\"ビール飲み放題ではなく言論の自由。このソフトウェアはAGPLライセンスで公開しています。\">無料かつオープンソース</a>の協同作業できるオンラインホワイトボードです。多くのユーザーが大きな仮想ホワイトボードに図などを書くことができ、接続しているすべてのユーザーの更新をリアルタイムに反映され、その状態を常に保存します。これはアート、エンタテインメント、デザインや教育など、様々な用途で使用できます。",
        "keyboard_shortcut": "キーボードショートカット",
        "loading": "読み込み中",
        "menu": "メニュー",
        "mousewheel": "ねずみ車",
        "mover": "変位",
        "named_private_board_description": "<strong>名前つきプライベートボード</strong>を作ることもできます。このボードは名前かURLを知っている人だけがアクセスできます。",
        "opacity": "透明度",
        "open_public_board": "公開ボードを作成する",
        "pencil": "ペン",
        "private_board_description": "プライベートな情報を共有したいときは、ランダムな名前を持つ、<b>プライベートボード</b>を作成できます。このボードはリンクを知っている人がアクセスできます。",
        "public_board_description": "<b>公開ボード</b>は、WBOにアクセスできる人であれば誰でも参加できますが、これは一時的な用途に向いています。",
        "recent_boards": "Recent Boards",
        "rectangle": "矩形",
        "share_instructions": "URLを送るだけで、リアルタイムな共同作業ができます。",
        "size": "サイズ",
        "square": "正方形",
        "straight_line": "直線",
        "tagline": "無料でオープンソースの協同作業できるオンラインホワイトボード。WBOでアイディアを共有しましょう!",
        "text": "テキスト",
        "tools": "ツール",
        "view_source": "GitHubでソースコード見る",
        "white-out": "修正液",
        "zoom": "拡大・縮小"
      },
      "pt": {
        "White-out": "Branquejar",
        "board_name_placeholder": "Nome do quadro...",
        "circle": "Círculo",
        "click_to_toggle": "clique para alternar",
        "click_to_zoom": "Clique para aumentar o zoom\nPressione shift e clique para diminuir o zoom",
        "collaborative_whiteboard": "Quadro branco colaborativo",
        "color": "Cor",
        "configuration": "Configuração",
        "create_private_board": "Crie um quadro privado",
        "ellipse": "Elipse",
        "eraser": "Borracha",
        "grid": "Grade",
        "hand": "Mão",
        "index_title": "Bem-vindo ao quadro branco online gratuito WBO!",
        "introduction_paragraph": "WBO é um quadro branco colaborativo online <a href=\"https://github.com/lovasoa/whitebophir\" title=\"Free as in free speech, não uma cerveja gratuita. Este software é lançado sob a licença AGPL\"> livre e de código aberto </a> que permite que muitos usuários desenhem simultaneamente em um grande quadro virtual. O quadro é atualizado em tempo real para todos os usuários conectados e seu estado é sempre persistido. Ele pode ser usado para muitos propósitos diferentes, incluindo arte, entretenimento, design e ensino.",
        "keyboard_shortcut": "atalho de teclado",
        "loading": "Carregando",
        "menu": "Menu",
        "mousewheel": "roda do mouse",
        "mover": "Mover",
        "named_private_board_description": "Você também pode criar um <strong>quadro privado com nome</strong>, uma URL personalizado, que estará acessível a todos aqueles que sabem seu nome.",
        "opacity": "Opacidade",
        "open_public_board": "Vá para o quadro público",
        "pencil": "Lápis",
        "private_board_description": "Você pode criar um <b> fórum privado </b> com um nome aleatório, que será acessível apenas por seu link. Use-o se quiser compartilhar informações privadas.",
        "public_board_description": "O <b> quadro público </b> está acessível a todos. É uma bagunça felizmente desorganizada, onde você pode se encontrar com estranhos anônimos e se reunir. Tudo ali é efêmero.",
        "recent_boards": "Recent Boards",
        "rectangle": "Retângulo",
        "share_instructions": "Para colaborar em um desenho em tempo real com alguém, basta compartilhar sua URL.",
        "size": "Tamanho",
        "square": "Quadrado",
        "straight_line": "Linha reta",
        "tagline": "Uma ferramenta de desenho colaborativo online gratuita e de código aberto. Esboce novas ideias juntos no WBO!",
        "text": "Texto",
        "tools": "Ferramentas",
        "view_source": "Código-fonte no GitHub",
        "zoom": "Zoom"
      },
      "ru": {
        "board_name_placeholder": "Название доски",
        "circle": "Круг",
        "click_to_toggle": "нажмите, чтобы переключиться",
        "collaborative_whiteboard": "Онлайн доска для совместного рисования",
        "color": "Цвет",
        "configuration": "Настройки",
        "create_private_board": "Создать приватную доску",
        "ellipse": "Эллипс",
        "eraser": "Ластик",
        "grid": "Сетка",
        "hand": "Рука",
        "index_title": "Добро пожаловать на WBO !",
        "introduction_paragraph": "WBO это бесплатная и <a href=\"https://github.com/lovasoa/whitebophir\" title=\"открытый исходный код\">открытая</a> виртуальная онлайн доска, позволяющая рисовать одновременно сразу нескольким пользователям. С WBO вы сможете рисовать, работать с коллегами над будущими проектами, проводить онлайн встречи, подкреплять ваши обучающие материалы и даже пробовать себя в дизайне. WBO доступен без регистрации.",
        "keyboard_shortcut": "горячая клавиша",
        "loading": "Загрузка",
        "menu": "Панель",
        "mousewheel": "колёсико мыши ",
        "mover": "Сдвинуть объект",
        "named_private_board_description": "Также можно создать <b>именную приватную доску</b> которая будет доступна всем тем, кому вы отправили название вашей доски.",
        "opacity": "Непрозрачность",
        "open_public_board": "Открыть анонимную доску",
        "pencil": "Карандаш",
        "private_board_description": "<b>Приватная доска</b> обладает тем же функционалом, что и анонимная доска. Разница в том, что приватную доску могут видеть только те пользователи, у которых на нее есть ссылка. Используйте приватную онлайн доску в рабочих целях, проводите онлайн уроки, рисуйте с детьми или друзьями. Другие пользователи не смогут удалять или менять ваши работы без вашего разрешения.",
        "public_board_description": "<b>Анонимная доска</b> позволяет рисовать вместе онлайн. Используйте этот формат для творчества и кучи разных идей. Вдохновляйтесь уже существующими рисунками, дополняйте их и создавайте совместные работы с другими посетителями. Любой пользователь может удалять уже существующие элементы и рисунки.",
        "recent_boards": "Недавние доски",
        "rectangle": "Прямоугольник",
        "share_instructions": "Использовать платформу для совместного творчества очень просто. Достаточно поделиться ссылкой URL с теми, кто хочет с вами порисовать. Как только они получат URL они смогут к вам присоединиться.",
        "size": "Размер",
        "square": "Квадрат",
        "straight_line": "Прямая линия",
        "tagline": "Бесплатная и открытая доска для совместной работы в интернете. Рисуете свои идеи вместе в WBO !",
        "text": "Текст",
        "tools": "Инструменты",
        "view_source": "Исходный код на GitHub",
        "white-out": "Корректор",
        "zoom": "Лупа"
      },
      "uk": {
        "White-out": "Коректор",
        "board_name_placeholder": "Назва дошки…",
        "circle": "Коло",
        "click_to_toggle": "клацніть, щоб перемкнути",
        "click_to_zoom": "Клацніть для збільшення\nНатисніть shift та клацініть для зменшення",
        "collaborative_whiteboard": "Онлайн дошка для спільної роботи",
        "color": "Колір",
        "configuration": "Налаштування",
        "create_private_board": "Створити особисту дошку",
        "ellipse": "Еліпс",
        "eraser": "Ґумка",
        "grid": "Сітка",
        "hand": "Рука",
        "index_title": "Вітаємо у відкритій онлайн дошці WBO!",
        "introduction_paragraph": "WBO це <a href=\"https://github.com/lovasoa/whitebophir\" title=\"Free as in free speech, not free beer. This software is released under the AGPL license\">безкоштовна та відкрита</a> онлайн дошка для спільної роботи, яка дозволяє багатьом користувачам одночасно писати на великій віртуальній дошці. Дошка оновлюється в реальному часі для всіх приєднаних користувачів, та її стан постійно зберігається. Вона може застосовуватись з різною метою, включаючи мистецтво, розваги, дизайн та навчання.",
        "keyboard_shortcut": "швидкі клавіші",
        "loading": "Завантаження",
        "menu": "Меню",
        "mousewheel": "коліщатко миші",
        "mover": "Пересунути",
        "named_private_board_description": "Ви також можете створити <strong>особисту дошку з назвою</strong>, з власним URL, яка буде доступна всім, хто знає її назву.",
        "opacity": "Прозорість",
        "open_public_board": "Перейти до публічної дошки",
        "pencil": "Олівець",
        "private_board_description": "Ви можете створити <b>особисту дошку</b> з випадковою назвою, яка буде доступна лише за відповідним посиланням. Користуйтесь нею, якшо Вам потрібно ділитись особистою інформацією.",
        "public_board_description": "<b>Публічна дошка</b> доступна для всіх. Там панує повний безлад, де Ви можете зустріти анонімних незнайомців та малювати разом. Тут все ефемерне.",
        "recent_boards": "Recent Boards",
        "rectangle": "Прямокутник",
        "share_instructions": "Для спільної роботи на дошці досить повідомити іншій особі адресу URL.",
        "size": "Розмір",
        "square": "Квадрат",
        "straight_line": "Пряма лінія",
        "tagline": "Безкоштовний онлайн засіб для спільного малювання з відкритим кодом. Разом накресліть нові ідеї у WBO!",
        "text": "Текст",
        "tools": "Засоби",
        "view_source": "Вихідний код на GitHub",
        "zoom": "Лупа"
      },
      "vn": {
        "White-out": "Trắng",
        "board_name_placeholder": "Tên bản …",
        "circle": "Tròn",
        "click_to_toggle": "Bật/tắt",
        "click_to_zoom": "Nhấp để phóng to \n Nhấn shift và nhấp để thu nhỏ",
        "collaborative_whiteboard": "Bảng trắng cộng tác",
        "color": "Màu",
        "configuration": "Cấu hình",
        "create_private_board": "Tạo một bảng riêng",
        "ellipse": "Hình elip",
        "eraser": "Tẩy",
        "grid": "Grid",
        "hand": "Tay",
        "index_title": "Chào mừng bạn đến với WBO bảng trắng trực tuyến miễn phí!",
        "introduction_paragraph": "WBO là một <a href=\"https://github.com/lovasoa/whitebophir\" title=\"Miễn phí như trong tự do ngôn luận, không phải bia miễn phí. Phần mềm này được phát hành theo giấy phép AGPL\">Miễn phí và open-source</a> cho phép nhiều người dùng vẽ đồng thời trên một bảng ảo lớn. Bảng này được cập nhật theo thời gian thực cho tất cả người dùng được kết nối và trạng thái luôn tồn tại. Nó có thể được sử dụng cho nhiều mục đích khác nhau, bao gồm nghệ thuật, giải trí, thiết kế và giảng dạy.",
        "keyboard_shortcut": "Phím tắt",
        "loading": "Đang tải",
        "menu": "Menu",
        "mousewheel": "Lăn chuột",
        "mover": "Di chuyển",
        "named_private_board_description": "Bạn cũng có thể tạo <strong> bảng riêng được đặt tên </strong>, với URL tùy chỉnh, tất cả những người biết tên của nó đều có thể truy cập được.",
        "opacity": "Độ Mờ",
        "open_public_board": "Đi tới bảng công khai",
        "pencil": "Gạch ngang",
        "private_board_description": "Bạn có thể tạo một <b> bảng riêng </b> với một tên ngẫu nhiên, chỉ có thể truy cập được bằng liên kết của nó. Sử dụng cái này nếu bạn muốn chia sẻ thông tin cá nhân.",
        "public_board_description": "Tất cả mọi người đều có thể truy cập <b> bảng công khai </b>. Đó là một mớ hỗn độn vô tổ chức vui vẻ, nơi bạn có thể gặp gỡ những người lạ vô danh và cùng nhau vẽ. Mọi thứ ở đó là phù du.",
        "recent_boards": "Recent Boards",
        "rectangle": "Chữ nhật",
        "share_instructions": "Để cộng tác trên một bản vẽ trong thời gian thực với ai đó, chỉ cần gửi cho họ URL của bản vẽ đó.",
        "size": "Size",
        "square": "Vuông",
        "straight_line": "Đường thẳng",
        "tagline": "Một công cụ vẽ cộng tác trực tuyến miễn phí và mã nguồn mở. Cùng nhau phác thảo những ý tưởng mới trên WBO!",
        "text": "Text",
        "tools": "Công cụ",
        "view_source": "Source code on GitHub",
        "zoom": "Zoom"
      },
      "zh": {
        "board_name_placeholder": "白板名称",
        "circle": "圈",
        "click_to_toggle": "单击以切换",
        "click_to_zoom": "点击放大。\n保持班次并单击缩小。",
        "collaborative_whiteboard": "在线协作式白板",
        "color": "颜色",
        "configuration": "刷设置",
        "create_private_board": "创建私人白板",
        "ellipse": "椭圆",
        "eraser": "橡皮",
        "grid": "格",
        "hand": "移动",
        "index_title": "欢迎来到 WBO！",
        "introduction_paragraph": " WBO是一<a href=\"https://github.com/lovasoa/whitebophir\">个免费的</a>、开源的在线协作白板，它允许许多用户同时在一个大型虚拟板上画图。该板对所有连接的用户实时更新，并且始终可用。它可以用于许多不同的目的，包括艺术、娱乐、设计和教学。",
        "keyboard_shortcut": "键盘快捷键",
        "loading": "载入中",
        "menu": "目录",
        "mousewheel": "鼠标轮",
        "mover": "平移",
        "named_private_board_description": "您还可以创建一个命名的私有白板，它有一个自定义的URL，所有知道它名字的人都可以访问它。",
        "opacity": "不透明度",
        "open_public_board": "进入公共白板",
        "pencil": "铅笔",
        "private_board_description": "您可以创建一个带有随机名称的私有白板，该白板只能通过其链接访问。如果要共享私人信息，请使用此选项。",
        "public_board_description": "每个人都可以使用公共白板。这是一个令人愉快的混乱的地方，你可以会见匿名陌生人，并在一起。那里的一切都是短暂的。",
        "recent_boards": "Recent Boards",
        "rectangle": "矩形",
        "share_instructions": "要与某人实时协作绘制图形，只需向他们发送白板的URL。",
        "size": "尺寸",
        "square": "正方形",
        "straight_line": "直线",
        "tagline": "打开即用的免费在线白板工具",
        "text": "文本",
        "tools": "工具",
        "view_source": "GitHub上的源代码",
        "white-out": "修正液",
        "zoom": "放大"
      }
    }
  //=====================================================================
  var configuration = {"MAX_BOARD_SIZE":65536,"MAX_EMIT_COUNT":192,"MAX_EMIT_COUNT_PERIOD":4096,"BLOCKED_TOOLS":[""],"AUTO_FINGER_WHITEOUT":true}  
//===================================================================

/**
 *                        MINITPL
 *********************************************************
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2013  Ophir LOJKINE
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend
 */

 var Minitpl = (function () {

	function Minitpl(elem, data) {
		this.elem = (typeof (elem) === "string") ? document.querySelector(elem) : elem;
		if (!elem) {
			throw "Invalid element!";
		}
		this.parent = this.elem.parentNode;
		this.parent.removeChild(this.elem);
	}

	function transform(element, transformer) {
		if (typeof (transformer) === "function") {
			transformer(element);
		} else {
			element.textContent = transformer;
		}
	}

	Minitpl.prototype.add = function (data) {
		var newElem = this.elem.cloneNode(true);
		if (typeof (data) === "object") {
			for (var key in data) {
				var matches = newElem.querySelectorAll(key);
				for (var i = 0; i < matches.length; i++) {
					transform(matches[i], data[key]);
				}
			}
		} else {
			transform(newElem, data);
		}
		this.parent.appendChild(newElem);
		return newElem;
	}

	return Minitpl;
}());


//===========================================================    
    /**
 *                        WHITEBOPHIR
 *********************************************************
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2013  Ophir LOJKINE
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend
 */

var Tools = {};

Tools.i18n = (function i18n() {
	// var translations = JSON.parse(document.getElementById("translations").text);
	return {
		"t": function translate(s) {
			var key = s.toLowerCase().replace(/ /g, '_');
			return translations[key] || s;
		}
	};
})();

Tools.server_config = configuration;

Tools.board = document.getElementById("board");
Tools.svg = document.getElementById("canvas");
Tools.drawingArea = Tools.svg.getElementById("drawingArea");

//Initialization
Tools.curTool = null;
Tools.drawingEvent = true;
Tools.showMarker = true;
Tools.showOtherCursors = true;
Tools.showMyCursor = true;

Tools.isIE = /MSIE|Trident/.test(window.navigator.userAgent);

Tools.socket = null;
Tools.connect = function () {
	var self = this;

	// Destroy socket if one already exists
	if (self.socket) {
		self.socket.destroy();
		delete self.socket;
		self.socket = null;
	}

	
	this.socket = io.connect('', {
		"path": "/socket.io/wb",
		"reconnection": true,
		"reconnectionDelay": 100, //Make the xhr connections as fast as possible
		"timeout": 1000 * 60 * 20 // Timeout after 20 minutes
	});

	//Receive draw instructions from the server
	this.socket.on("broadcast", function (msg) {
		handleMessage(msg).finally(function afterload() {
			var loadingEl = document.getElementById("loadingMessage");
			loadingEl.classList.add("hidden");
		});
	});

	this.socket.on("reconnect", function onReconnection() {
		Tools.socket.emit('joinboard', Tools.boardName);
	});
};

Tools.connect();

Tools.boardName = (function () {
	var path = window.location.pathname.split("/");
	return decodeURIComponent(path[path.length - 1]);
})();

//Get the board as soon as the page is loaded
Tools.socket.emit("getboard", Tools.boardName);

// function saveBoardNametoLocalStorage() {
// 	var boardName = Tools.boardName;
// 	if (boardName.toLowerCase() === 'anonymous') return;
// 	var recentBoards, key = "recent-boards";
// 	try {
// 		recentBoards = JSON.parse(localStorage.getItem(key));
// 		if (!Array.isArray(recentBoards)) throw new Error("Invalid type");
// 	} catch(e) {
// 		// On localstorage or json error, reset board list
// 		recentBoards = [];
// 		console.log("Board history loading error", e);
// 	}
// 	recentBoards = recentBoards.filter(function (name) {
// 		return name !== boardName;
// 	});
// 	recentBoards.unshift(boardName);
// 	recentBoards = recentBoards.slice(0, 20);
// 	localStorage.setItem(key, JSON.stringify(recentBoards));
// }
// Refresh recent boards list on each page show
window.addEventListener("pageshow",()=>saveBoardNametoLocalStorage(Tools.boardName));

Tools.HTML = {
	template: new Minitpl("#tools > .tool"),
	addShortcut: function addShortcut(key, callback) {
		window.addEventListener("keydown", function (e) {
			if (e.key === key && !e.target.matches("input[type=text], textarea")) {
				callback();
			}
		});
	},
	addTool: function (toolName, toolIcon, toolIconHTML, toolShortcut, oneTouch) {
		var callback = function () {
			Tools.change(toolName);
		};
		this.addShortcut(toolShortcut, function () {
			Tools.change(toolName);
			document.activeElement.blur && document.activeElement.blur();
		});
		return this.template.add(function (elem) {
			elem.addEventListener("click", callback);
			elem.id = "toolID-" + toolName;
			elem.getElementsByClassName("tool-name")[0].textContent = Tools.i18n.t(toolName);
			var toolIconElem = elem.getElementsByClassName("tool-icon")[0];
			toolIconElem.src = toolIcon;
			toolIconElem.alt = toolIcon;
			if (oneTouch) elem.classList.add("oneTouch");
			elem.title =
				Tools.i18n.t(toolName) + " (" +
				Tools.i18n.t("keyboard shortcut") + ": " +
				toolShortcut + ")" +
				(Tools.list[toolName].secondary ? " [" + Tools.i18n.t("click_to_toggle") + "]" : "");
			if (Tools.list[toolName].secondary) {
				elem.classList.add('hasSecondary');
				var secondaryIcon = elem.getElementsByClassName('secondaryIcon')[0];
				secondaryIcon.src = Tools.list[toolName].secondary.icon;
				toolIconElem.classList.add("primaryIcon");
			}
		});
	},
	changeTool: function (oldToolName, newToolName) {
		var oldTool = document.getElementById("toolID-" + oldToolName);
		var newTool = document.getElementById("toolID-" + newToolName);
		if (oldTool) oldTool.classList.remove("curTool");
		if (newTool) newTool.classList.add("curTool");
	},
	toggle: function (toolName, name, icon) {
		var elem = document.getElementById("toolID-" + toolName);

		// Change secondary icon
		var primaryIcon = elem.getElementsByClassName("primaryIcon")[0];
		var secondaryIcon = elem.getElementsByClassName("secondaryIcon")[0];
		var primaryIconSrc = primaryIcon.src;
		var secondaryIconSrc = secondaryIcon.src;
		primaryIcon.src = secondaryIconSrc;
		secondaryIcon.src = primaryIconSrc;

		// Change primary icon
		elem.getElementsByClassName("tool-icon")[0].src = icon;
		elem.getElementsByClassName("tool-name")[0].textContent = Tools.i18n.t(name);
	},
	addStylesheet: function (href) {
		//Adds a css stylesheet to the html or svg document
		var link = document.createElement("link");
		link.href = href;
		link.rel = "stylesheet";
		link.type = "text/css";
		document.head.appendChild(link);
	},
	colorPresetTemplate: new Minitpl("#colorPresetSel .colorPresetButton"),
	addColorButton: function (button) {
		var setColor = Tools.setColor.bind(Tools, button.color);
		if (button.key) this.addShortcut(button.key, setColor);
		return this.colorPresetTemplate.add(function (elem) {
			elem.addEventListener("click", setColor);
			elem.id = "color_" + button.color.replace(/^#/, '');
			elem.style.backgroundColor = button.color;
			if (button.key) {
				elem.title = Tools.i18n.t("keyboard shortcut") + ": " + button.key;
			}
		});
	}
};

Tools.list = {}; // An array of all known tools. {"toolName" : {toolObject}}

Tools.isBlocked = function toolIsBanned(tool) {
	if (tool.name.includes(",")) throw new Error("Tool Names must not contain a comma");
	return Tools.server_config.BLOCKED_TOOLS.includes(tool.name);
};

/**
 * Register a new tool, without touching the User Interface
 */
Tools.register = function registerTool(newTool) {
	if (Tools.isBlocked(newTool)) return;

	if (newTool.name in Tools.list) {
		console.log("Tools.add: The tool '" + newTool.name + "' is already" +
			"in the list. Updating it...");
	}

	//Format the new tool correctly
	Tools.applyHooks(Tools.toolHooks, newTool);

	//Add the tool to the list
	Tools.list[newTool.name] = newTool;

	// Register the change handlers
	if (newTool.onSizeChange) Tools.sizeChangeHandlers.push(newTool.onSizeChange);

	//There may be pending messages for the tool
	var pending = Tools.pendingMessages[newTool.name];
	if (pending) {
		console.log("Drawing pending messages for '%s'.", newTool.name);
		var msg;
		while (msg = pending.shift()) {
			//Transmit the message to the tool (precising that it comes from the network)
			newTool.draw(msg, false);
		}
	}
};

/**
 * Add a new tool to the user interface
 */
Tools.add = function (newTool) {
	if (Tools.isBlocked(newTool)) return;

	Tools.register(newTool);

	if (newTool.stylesheet) {
		Tools.HTML.addStylesheet(newTool.stylesheet);
	}

	//Add the tool to the GUI
	Tools.HTML.addTool(newTool.name, newTool.icon, newTool.iconHTML, newTool.shortcut, newTool.oneTouch);
};

Tools.change = function (toolName) {
	var newTool = Tools.list[toolName];
	var oldTool = Tools.curTool;
	if (!newTool) throw new Error("Trying to select a tool that has never been added!");
	if (newTool === oldTool) {
		if (newTool.secondary) {
			newTool.secondary.active = !newTool.secondary.active;
			var props = newTool.secondary.active ? newTool.secondary : newTool;
			Tools.HTML.toggle(newTool.name, props.name, props.icon);
			if (newTool.secondary.switch) newTool.secondary.switch();
		}
		return;
	}
	if (!newTool.oneTouch) {
		//Update the GUI
		var curToolName = (Tools.curTool) ? Tools.curTool.name : "";
		try {
			Tools.HTML.changeTool(curToolName, toolName);
		} catch (e) {
			console.error("Unable to update the GUI with the new tool. " + e);
		}
		Tools.svg.style.cursor = newTool.mouseCursor || "auto";
		Tools.board.title = Tools.i18n.t(newTool.helpText || "");

		//There is not necessarily already a curTool
		if (Tools.curTool !== null) {
			//It's useless to do anything if the new tool is already selected
			if (newTool === Tools.curTool) return;

			//Remove the old event listeners
			Tools.removeToolListeners(Tools.curTool);

			//Call the callbacks of the old tool
			Tools.curTool.onquit(newTool);
		}

		//Add the new event listeners
		Tools.addToolListeners(newTool);
		Tools.curTool = newTool;
	}

	//Call the start callback of the new tool
	newTool.onstart(oldTool);
};

Tools.addToolListeners = function addToolListeners(tool) {
	for (var event in tool.compiledListeners) {
		var listener = tool.compiledListeners[event];
		var target = listener.target || Tools.board;
		target.addEventListener(event, listener, { 'passive': false });
	}
};

Tools.removeToolListeners = function removeToolListeners(tool) {
	for (var event in tool.compiledListeners) {
		var listener = tool.compiledListeners[event];
		var target = listener.target || Tools.board;
		target.removeEventListener(event, listener);
		// also attempt to remove with capture = true in IE
		if (Tools.isIE) target.removeEventListener(event, listener, true);
	}
};

(function () {
	// Handle secondary tool switch with shift (key code 16)
	function handleShift(active, evt) {
		if (evt.keyCode === 16 && Tools.curTool.secondary && Tools.curTool.secondary.active !== active) {
			Tools.change(Tools.curTool.name);
		}
	}
	window.addEventListener("keydown", handleShift.bind(null, true));
	window.addEventListener("keyup", handleShift.bind(null, false));
})();

Tools.send = function (data, toolName) {
	toolName = toolName || Tools.curTool.name;
	var d = data;
	d.tool = toolName;
	Tools.applyHooks(Tools.messageHooks, d);
	var message = {
		"board": Tools.boardName,
		"data": d
	};
	Tools.socket.emit('broadcast', message);
};

Tools.drawAndSend = function (data, tool) {
	if (tool == null) tool = Tools.curTool;
	tool.draw(data, true);
	Tools.send(data, tool.name);
};

//Object containing the messages that have been received before the corresponding tool
//is loaded. keys : the name of the tool, values : array of messages for this tool
Tools.pendingMessages = {};

// Send a message to the corresponding tool
function messageForTool(message) {
	var name = message.tool,
		tool = Tools.list[name];

	if (tool) {
		Tools.applyHooks(Tools.messageHooks, message);
		tool.draw(message, false);
	} else {
		///We received a message destinated to a tool that we don't have
		//So we add it to the pending messages
		if (!Tools.pendingMessages[name]) Tools.pendingMessages[name] = [message];
		else Tools.pendingMessages[name].push(message);
	}

	if (message.tool !== 'Hand' && message.deltax != null && message.deltay != null) {
		//this message has special info for the mover
		messageForTool({ tool: 'Hand', type: 'update', deltax: message.deltax || 0, deltay: message.deltay || 0, id: message.id });
	}
}

// Apply the function to all arguments by batches
function batchCall(fn, args) {
	var BATCH_SIZE = 1024;
	if (args.length === 0) {
		return Promise.resolve();
	} else {
		var batch = args.slice(0, BATCH_SIZE);
		var rest = args.slice(BATCH_SIZE);
		return Promise.all(batch.map(fn))
			.then(function () {
				return new Promise(requestAnimationFrame);
			}).then(batchCall.bind(null, fn, rest));
	}
}

// Call messageForTool recursively on the message and its children
function handleMessage(message) {
	//Check if the message is in the expected format
	if (!message.tool && !message._children) {
		console.error("Received a badly formatted message (no tool). ", message);
	}
	if (message.tool) messageForTool(message);
	if (message._children) return batchCall(handleMessage, message._children);
	else return Promise.resolve();
}

Tools.unreadMessagesCount = 0;
Tools.newUnreadMessage = function () {
	Tools.unreadMessagesCount++;
	updateDocumentTitle();
};

window.addEventListener("focus", function () {
	Tools.unreadMessagesCount = 0;
	updateDocumentTitle();
});

function updateDocumentTitle() {
	document.title =
		(Tools.unreadMessagesCount ? '(' + Tools.unreadMessagesCount + ') ' : '') +
		Tools.boardName +
		" | WBO";
}

(function () {
	// Scroll and hash handling
	var scrollTimeout, lastStateUpdate = Date.now();

	window.addEventListener("scroll", function onScroll() {
		var scale = Tools.getScale();
		var x = document.documentElement.scrollLeft / scale,
			y = document.documentElement.scrollTop / scale;

		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(function updateHistory() {
			var hash = '#' + (x | 0) + ',' + (y | 0) + ',' + Tools.getScale().toFixed(1);
			if (Date.now() - lastStateUpdate > 5000 && hash !== window.location.hash) {
				window.history.pushState({}, "", hash);
				lastStateUpdate = Date.now();
			} else {
				window.history.replaceState({}, "", hash);
			}
		}, 100);
	});

	function setScrollFromHash() {
		var coords = window.location.hash.slice(1).split(',');
		var x = coords[0] | 0;
		var y = coords[1] | 0;
		var scale = parseFloat(coords[2]);
		resizeCanvas({ x: x, y: y });
		Tools.setScale(scale);
		window.scrollTo(x * scale, y * scale);
	}

	window.addEventListener("hashchange", setScrollFromHash, false);
	window.addEventListener("popstate", setScrollFromHash, false);
	window.addEventListener("DOMContentLoaded", setScrollFromHash, false);
})();

function resizeCanvas(m) {
	//Enlarge the canvas whenever something is drawn near its border
	var x = m.x | 0, y = m.y | 0
	var MAX_BOARD_SIZE = Tools.server_config.MAX_BOARD_SIZE || 65536; // Maximum value for any x or y on the board
	if (x > Tools.svg.width.baseVal.value - 2000) {
		Tools.svg.width.baseVal.value = 1500
	}
	if (y > Tools.svg.height.baseVal.value - 2000) {
		Tools.svg.height.baseVal.value = 1500

	}
}

function updateUnreadCount(m) {
	if (document.hidden && ["child", "update"].indexOf(m.type) === -1) {
		Tools.newUnreadMessage();
	}
}

// List of hook functions that will be applied to messages before sending or drawing them
Tools.messageHooks = [resizeCanvas, updateUnreadCount];

Tools.scale = window.innerWidth/1500;;
var scaleTimeout = null;
Tools.setScale = function setScale(scale) {
	var fullScale = Math.max(window.innerWidth, window.innerHeight) / Tools.server_config.MAX_BOARD_SIZE;
	var minScale = window.innerWidth/1500;
	var maxScale = 10;
	if (isNaN(scale)) scale = window.innerWidth/1500;;
	scale = Math.max(minScale, Math.min(maxScale, scale));
	Tools.svg.style.willChange = 'transform';
	Tools.svg.style.transform = 'scale(' + scale + ')';
	clearTimeout(scaleTimeout);
	scaleTimeout = setTimeout(function () {
		Tools.svg.style.willChange = 'auto';
	}, 1000);
	Tools.scale = scale;
	return scale;
}
Tools.getScale = function getScale() {
	return Tools.scale;
}

//List of hook functions that will be applied to tools before adding them
Tools.toolHooks = [
	function checkToolAttributes(tool) {
		if (typeof (tool.name) !== "string") throw "A tool must have a name";
		if (typeof (tool.listeners) !== "object") {
			tool.listeners = {};
		}
		if (typeof (tool.onstart) !== "function") {
			tool.onstart = function () { };
		}
		if (typeof (tool.onquit) !== "function") {
			tool.onquit = function () { };
		}
	},
	function compileListeners(tool) {
		//compile listeners into compiledListeners
		var listeners = tool.listeners;

		//A tool may provide precompiled listeners
		var compiled = tool.compiledListeners || {};
		tool.compiledListeners = compiled;

		function compile(listener) { //closure
			return (function listen(evt) {
				var x = evt.pageX / Tools.getScale(),
					y = evt.pageY / Tools.getScale();
				return listener(x, y, evt, false);
			});
		}

		function compileTouch(listener) { //closure
			return (function touchListen(evt) {
				//Currently, we don't handle multitouch
				if (evt.changedTouches.length === 1) {
					//evt.preventDefault();
					var touch = evt.changedTouches[0];
					var x = touch.pageX / Tools.getScale(),
						y = touch.pageY / Tools.getScale();
					return listener(x, y, evt, true);
				}
				return true;
			});
		}

		function wrapUnsetHover(f, toolName) {
			return (function unsetHover(evt) {
				document.activeElement && document.activeElement.blur && document.activeElement.blur();
				return f(evt);
			});
		}

		if (listeners.press) {
			compiled["mousedown"] = wrapUnsetHover(compile(listeners.press), tool.name);
			compiled["touchstart"] = wrapUnsetHover(compileTouch(listeners.press), tool.name);
		}
		if (listeners.move) {
			compiled["mousemove"] = compile(listeners.move);
			compiled["touchmove"] = compileTouch(listeners.move);
		}
		if (listeners.release) {
			var release = compile(listeners.release),
				releaseTouch = compileTouch(listeners.release);
			compiled["mouseup"] = release;
			if (!Tools.isIE) compiled["mouseleave"] = release;
			compiled["touchleave"] = releaseTouch;
			compiled["touchend"] = releaseTouch;
			compiled["touchcancel"] = releaseTouch;
		}
	}
];

Tools.applyHooks = function (hooks, object) {
	//Apply every hooks on the object
	hooks.forEach(function (hook) {
		hook(object);
	});
};


// Utility functions

Tools.generateUID = function (prefix, suffix) {
	var uid = Date.now().toString(36); //Create the uids in chronological order
	uid += (Math.round(Math.random() * 36)).toString(36); //Add a random character at the end
	if (prefix) uid = prefix + uid;
	if (suffix) uid = uid + suffix;
	return uid;
};

Tools.createSVGElement = function createSVGElement(name, attrs) {
	var elem = document.createElementNS(Tools.svg.namespaceURI, name);
	if (typeof (attrs) !== "object") return elem;
	Object.keys(attrs).forEach(function (key, i) {
		elem.setAttributeNS(null, key, attrs[key]);
	});
	return elem;
};

Tools.positionElement = function (elem, x, y) {
	elem.style.top = y + "px";
	elem.style.left = x + "px";
};

Tools.colorPresets = [
	{ color: "#001f3f", key: '1' },
	{ color: "#FF4136", key: '2' },
	{ color: "#0074D9", key: '3' },
	{ color: "#FF851B", key: '4' },
	{ color: "#FFDC00", key: '5' },
	{ color: "#3D9970", key: '6' },
	{ color: "#91E99B", key: '7' },
	{ color: "#90468b", key: '8' },
	{ color: "#7FDBFF", key: '9' },
	{ color: "#AAAAAA", key: '0' },
	{ color: "#E65194" }
];

Tools.color_chooser = document.getElementById("chooseColor");

Tools.setColor = function (color) {
	Tools.color_chooser.value = color;
};

Tools.getColor = (function color() {
	var color_index = (Math.random() * Tools.colorPresets.length) | 0;
	var initial_color = Tools.colorPresets[color_index].color;
	Tools.setColor(initial_color);
	return function () { return Tools.color_chooser.value; };
})();

Tools.colorPresets.forEach(Tools.HTML.addColorButton.bind(Tools.HTML));

Tools.sizeChangeHandlers = [];
Tools.setSize = (function size() {
	var chooser = document.getElementById("chooseSize");

	function update() {
		var size = Math.max(1, Math.min(50, chooser.value | 0));
		chooser.value = size;
		Tools.sizeChangeHandlers.forEach(function (handler) {
			handler(size);
		});
	}
	update();

	chooser.onchange = chooser.oninput = update;
	return function (value) {
		if (value !== null && value !== undefined) { chooser.value = value; update(); }
		return parseInt(chooser.value);
	};
})();

Tools.getSize = (function () { return Tools.setSize() });

Tools.getOpacity = (function opacity() {
	var chooser = document.getElementById("chooseOpacity");
	var opacityIndicator = document.getElementById("opacityIndicator");

	function update() {
		opacityIndicator.setAttribute("opacity", chooser.value);
	}
	update();

	chooser.onchange = chooser.oninput = update;
	return function () {
		return Math.max(0.1, Math.min(1, chooser.value));
	};
})();


//Scale the canvas on load
Tools.svg.width.baseVal.value = document.body.clientWidth;
Tools.svg.height.baseVal.value = document.body.clientHeight;

/**
 What does a "tool" object look like?
 newtool = {
	  "name" : "SuperTool",
	  "listeners" : {
			"press" : function(x,y,evt){...},
			"move" : function(x,y,evt){...},
			"release" : function(x,y,evt){...},
	  },
	  "draw" : function(data, isLocal){
			//Print the data on Tools.svg
	  },
	  "onstart" : function(oldTool){...},
	  "onquit" : function(newTool){...},
	  "stylesheet" : "style.css",
}
*/


//====================================================

  function dist(x1, y1, x2, y2) {
      //Returns the distance between (x1,y1) and (x2,y2)
      return Math.hypot(x2 - x1, y2 - y1);
  }

  /**
   * Represents a single operation in an SVG path
   * @param {string} type 
   * @param {number[]} values 
   */
  function PathDataPoint(type, values) {
      this.type = type;
      this.values = values;
  }

  /**
   * Given the existing points in a path, add a new point to get a smoothly interpolated path
   * @param {PathDataPoint[]} pts 
   * @param {number} x 
   * @param {number} y 
   */
  function wboPencilPoint(pts, x, y) {
      // pts represents the points that are already in the line as a PathData
      var nbr = pts.length; //The number of points already in the line
      var npoint;
      switch (nbr) {
          case 0: //The first point in the line
              //If there is no point, we have to start the line with a moveTo statement
              pts.push(new PathDataPoint("M", [x, y]));
              //Temporary first point so that clicks are shown and can be erased
              npoint = new PathDataPoint("L", [x, y]);
              break;
          case 1: //This should never happen
              // First point will be the move. Add Line of zero length ensure there are two points and fall through
              pts.push(new PathDataPoint("L", [pts[0].values[0], pts[0].values[1]]));
          // noinspection FallThroughInSwitchStatementJS
          case 2: //There are two points. The initial move and a line of zero length to make it visible
              //Draw a curve that is segment between the old point and the new one
              npoint = new PathDataPoint("C", [
                  pts[0].values[0], pts[0].values[1],
                  x, y,
                  x, y,
              ]);
              break;
          default: //There are at least two points in the line
              npoint = pencilExtrapolatePoints(pts, x, y);
      }
      if (npoint) pts.push(npoint);
      return pts;
  }

  function pencilExtrapolatePoints(pts, x, y) {
      //We add the new point, and smoothen the line
      var ANGULARITY = 3; //The lower this number, the smoother the line
      var prev_values = pts[pts.length - 1].values; // Previous point
      var ante_values = pts[pts.length - 2].values; // Point before the previous one
      var prev_x = prev_values[prev_values.length - 2];
      var prev_y = prev_values[prev_values.length - 1];
      var ante_x = ante_values[ante_values.length - 2];
      var ante_y = ante_values[ante_values.length - 1];


      //We don't want to add the same point twice consecutively
      if ((prev_x === x && prev_y === y)
          || (ante_x === x && ante_y === y)) return;

      var vectx = x - ante_x,
          vecty = y - ante_y;
      var norm = Math.hypot(vectx, vecty);
      var dist1 = dist(ante_x, ante_y, prev_x, prev_y) / norm,
          dist2 = dist(x, y, prev_x, prev_y) / norm;
      vectx /= ANGULARITY;
      vecty /= ANGULARITY;
      //Create 2 control points around the last point
      var cx1 = prev_x - dist1 * vectx,
          cy1 = prev_y - dist1 * vecty, //First control point
          cx2 = prev_x + dist2 * vectx,
          cy2 = prev_y + dist2 * vecty; //Second control point
      prev_values[2] = cx1;
      prev_values[3] = cy1;

      return new PathDataPoint("C", [
          cx2, cy2,
          x, y,
          x, y,
      ]);
  }

;

//===================================================================


/**
 *                        WHITEBOPHIR
 *********************************************************
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2013  Ophir LOJKINE
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend
 */

 (function () { //Code isolation

	// Allocate the full maximum server update rate to pencil messages.
	// This feels a bit risky in terms of dropped messages, but any less
	// gives terrible results with the default parameters.  In practice it
	// seems to work, either because writing tends to happen in bursts, or
	// maybe because the messages are sent when the time interval is *greater*
	// than this?
	var MIN_PENCIL_INTERVAL_MS = Tools.server_config.MAX_EMIT_COUNT_PERIOD / Tools.server_config.MAX_EMIT_COUNT;

	var AUTO_FINGER_WHITEOUT = Tools.server_config.AUTO_FINGER_WHITEOUT;
	var hasUsedStylus = false;

	//Indicates the id of the line the user is currently drawing or an empty string while the user is not drawing
	var curLineId = "",
		lastTime = performance.now(); //The time at which the last point was drawn

	//The data of the message that will be sent for every new point
	function PointMessage(x, y) {
		this.type = 'child';
		this.parent = curLineId;
		this.x = x;
		this.y = y;
	}

	function handleAutoWhiteOut(evt) {
		if (evt.touches && evt.touches[0] && evt.touches[0].touchType == "stylus") {
			//When using stylus, switch back to the primary
			if (hasUsedStylus && Tools.curTool.secondary.active) {
				Tools.change("Pencil");
			}
			//Remember if starting a line with a stylus
			hasUsedStylus = true;
		}
		if (evt.touches && evt.touches[0] && evt.touches[0].touchType == "direct") {
			//When used stylus and touched with a finger, switch to secondary
			if (hasUsedStylus && !Tools.curTool.secondary.active) {
				Tools.change("Pencil");
			}
		}
	}

	function startLine(x, y, evt) {

		//Prevent the press from being interpreted by the browser
		evt.preventDefault();

		if (AUTO_FINGER_WHITEOUT) handleAutoWhiteOut(evt);

		curLineId = Tools.generateUID("l"); //"l" for line

		Tools.drawAndSend({
			'type': 'line',
			'id': curLineId,
			'color': (pencilTool.secondary.active ? "#ffffff" : Tools.getColor()),
			'size': Tools.getSize(),
			'opacity': (pencilTool.secondary.active ? 1 : Tools.getOpacity()),
		});

		//Immediatly add a point to the line
		continueLine(x, y);
	}

	function continueLine(x, y, evt) {
		/*Wait 70ms before adding any point to the currently drawing line.
		This allows the animation to be smother*/
		if (curLineId !== "" && performance.now() - lastTime > MIN_PENCIL_INTERVAL_MS) {
			Tools.drawAndSend(new PointMessage(x, y));
			lastTime = performance.now();
		}
		if (evt) evt.preventDefault();
	}

	function stopLineAt(x, y) {
		//Add a last point to the line
		continueLine(x, y);
		stopLine();
	}

	function stopLine() {
		curLineId = "";
	}

	var renderingLine = {};
	function draw(data) {
		Tools.drawingEvent = true;
		switch (data.type) {
			case "line":
				renderingLine = createLine(data);
				break;
			case "child":
				var line = (renderingLine.id === data.parent) ? renderingLine : svg.getElementById(data.parent);
				if (!line) {
					console.error("Pencil: Hmmm... I received a point of a line that has not been created (%s).", data.parent);
					line = renderingLine = createLine({ "id": data.parent }); //create a new line in order not to loose the points
				}
				addPoint(line, data.x, data.y);
				break;
			case "endline":
				//TODO?
				break;
			default:
				console.error("Pencil: Draw instruction with unknown type. ", data);
				break;
		}
	}

	var pathDataCache = {};
	function getPathData(line) {
		var pathData = pathDataCache[line.id];
		if (!pathData) {
			pathData = line.getPathData();
			pathDataCache[line.id] = pathData;
		}
		return pathData;
	}

	var svg = Tools.svg;

	function addPoint(line, x, y) {
		var pts = getPathData(line);
		pts = wboPencilPoint(pts, x, y);
		line.setPathData(pts);
	}

	function createLine(lineData) {
		//Creates a new line on the canvas, or update a line that already exists with new information
		var line = svg.getElementById(lineData.id) || Tools.createSVGElement("path");
		line.id = lineData.id;
		//If some data is not provided, choose default value. The line may be updated later
		line.setAttribute("stroke", lineData.color || "black");
		line.setAttribute("stroke-width", lineData.size || 10);
		line.setAttribute("opacity", Math.max(0.1, Math.min(1, lineData.opacity)) || 1);
		Tools.drawingArea.appendChild(line);
		return line;
	}

	//Remember drawing and white-out sizes separately
	var drawingSize = -1;
	var whiteOutSize = -1;

	function restoreDrawingSize() {
		whiteOutSize = Tools.getSize();
		if (drawingSize != -1) {
			Tools.setSize(drawingSize);
		}
	}

	function restoreWhiteOutSize() {
		drawingSize = Tools.getSize();
		if (whiteOutSize != -1) {
			Tools.setSize(whiteOutSize);
		}
	}

	//Restore remembered size after switch
	function toggleSize() {
		if (pencilTool.secondary.active) {
			restoreWhiteOutSize();
		} else {
			restoreDrawingSize();
		}
	}

	var pencilTool = {
		"name": "Pencil",
		"shortcut": "p",
		"listeners": {
			"press": startLine,
			"move": continueLine,
			"release": stopLineAt,
		},
		"draw": draw,
		"onstart": function(oldTool) {
			//Reset stylus
			hasUsedStylus = false;
		},
		"secondary": {
			"name": "White-out",
			"icon": "tools/pencil/whiteout_tape.svg",
			"active": false,
			"switch": function() {
				stopLine();
				toggleSize();
			},
		},
		"onstart": function() {
			//When switching from another tool to white-out, restore white-out size
			if (pencilTool.secondary.active) {
				restoreWhiteOutSize();
			}
		},
		"onquit": function() {
			//When switching from white-out to another tool, restore drawing size
			if (pencilTool.secondary.active) {
				restoreDrawingSize();
			}
		},
		"mouseCursor": "url('tools/pencil/cursor.svg'), crosshair",
		"icon": "tools/pencil/icon.svg",
		"stylesheet": "tools/pencil/pencil.css",
	};
	Tools.add(pencilTool);

})(); //End of code isolation
//===================================================


/**
 *                        WHITEBOPHIR
 *********************************************************
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2020  Ophir LOJKINE
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend
 */

 (function () { // Code isolation

  // Allocate half of the maximum server updates to cursor updates
  var MIN_CURSOR_UPDATES_INTERVAL_MS = Tools.server_config.MAX_EMIT_COUNT_PERIOD / Tools.server_config.MAX_EMIT_COUNT * 2;

  var CURSOR_DELETE_AFTER_MS = 1000 * 5;

  var lastCursorUpdate = 0;
  var sending = true;

  var cursorTool = {
      "name": "Cursor",
      "listeners": {
          "press": function () { sending = false },
          "move": handleMarker,
          "release": function () { sending = true },
      },
      "onSizeChange": onSizeChange,
      "draw": draw,
      "mouseCursor": "crosshair",
      "icon": "tools/pencil/icon.svg",
  };
  Tools.register(cursorTool);
  Tools.addToolListeners(cursorTool);

  var message = {
      type: "update",
      x: 0,
      y: 0,
      color: Tools.getColor(),
      size: Tools.getSize(),
  };

  function handleMarker(x, y) {
      // throttle local cursor updates
      message.x = x;
      message.y = y;
      message.color = Tools.getColor();
      message.size = Tools.getSize();
      updateMarker();
  }

  function onSizeChange(size) {
      message.size = size;
      updateMarker();
  }

  function updateMarker() {
      if (!Tools.showMarker || !Tools.showMyCursor) return;
      var cur_time = Date.now();
      if (cur_time - lastCursorUpdate > MIN_CURSOR_UPDATES_INTERVAL_MS &&
          (sending || Tools.curTool.showMarker)) {
          Tools.drawAndSend(message, cursorTool);
          lastCursorUpdate = cur_time;
      } else {
          draw(message);
      }
  }

  var cursorsElem = Tools.svg.getElementById("cursors");

  function createCursor(id) {
      var cursor = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      cursor.setAttributeNS(null, "class", "opcursor");
      cursor.setAttributeNS(null, "id", id);
      cursor.setAttributeNS(null, "cx", 0);
      cursor.setAttributeNS(null, "cy", 0);
      cursor.setAttributeNS(null, "r", 10);
      cursorsElem.appendChild(cursor);
      setTimeout(function () {
          cursorsElem.removeChild(cursor);
      }, CURSOR_DELETE_AFTER_MS);
      return cursor;
  }

  function getCursor(id) {
      return document.getElementById(id) || createCursor(id);
  }

  function draw(message) {
      var cursor = getCursor("cursor-" + (message.socket || 'me'));
      cursor.style.transform = "translate(" + message.x + "px, " + message.y + "px)";
      if (Tools.isIE) cursor.setAttributeNS(null, "transform", "translate(" + message.x + " " + message.y + ")");
      cursor.setAttributeNS(null, "fill", message.color);
      cursor.setAttributeNS(null, "r", message.size / 2);
  }
})();


//==========================================================
/**
 *                        WHITEBOPHIR
 *********************************************************
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2013  Ophir LOJKINE
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend
 */

 (function () { //Code isolation
	//Indicates the id of the line the user is currently drawing or an empty string while the user is not drawing
	var curLine = null,
		lastTime = performance.now(); //The time at which the last point was drawn

	//The data of the message that will be sent for every update
	function UpdateMessage(x, y) {
		this.type = 'update';
		this.id = curLine.id;
		this.x2 = x;
		this.y2 = y;
	}

	function startLine(x, y, evt) {

		//Prevent the press from being interpreted by the browser
		evt.preventDefault();

		curLine = {
			'type': 'straight',
			'id': Tools.generateUID("s"), //"s" for straight line
			'color': Tools.getColor(),
			'size': Tools.getSize(),
			'opacity': Tools.getOpacity(),
			'x': x,
			'y': y
		}

		Tools.drawAndSend(curLine);
	}

	function continueLine(x, y, evt) {
		/*Wait 70ms before adding any point to the currently drawing line.
		This allows the animation to be smother*/
		if (curLine !== null) {
			if (lineTool.secondary.active) {
				var alpha = Math.atan2(y - curLine.y, x - curLine.x);
				var d = Math.hypot(y - curLine.y, x - curLine.x);
				var increment = 2 * Math.PI / 16;
				alpha = Math.round(alpha / increment) * increment;
				x = curLine.x + d * Math.cos(alpha);
				y = curLine.y + d * Math.sin(alpha);
			}
			if (performance.now() - lastTime > 70) {
				Tools.drawAndSend(new UpdateMessage(x, y));
				lastTime = performance.now();
			} else {
				draw(new UpdateMessage(x, y));
			}
		}
		if (evt) evt.preventDefault();
	}

	function stopLine(x, y) {
		//Add a last point to the line
		continueLine(x, y);
		curLine = null;
	}

	function draw(data) {
		switch (data.type) {
			case "straight":
				createLine(data);
				break;
			case "update":
				var line = svg.getElementById(data['id']);
				if (!line) {
					console.error("Straight line: Hmmm... I received a point of a line that has not been created (%s).", data['id']);
					createLine({ //create a new line in order not to loose the points
						"id": data['id'],
						"x": data['x2'],
						"y": data['y2']
					});
				}
				updateLine(line, data);
				break;
			default:
				console.error("Straight Line: Draw instruction with unknown type. ", data);
				break;
		}
	}

	var svg = Tools.svg;
	function createLine(lineData) {
		//Creates a new line on the canvas, or update a line that already exists with new information
		var line = svg.getElementById(lineData.id) || Tools.createSVGElement("line");
		line.id = lineData.id;
		line.x1.baseVal.value = lineData['x'];
		line.y1.baseVal.value = lineData['y'];
		line.x2.baseVal.value = lineData['x2'] || lineData['x'];
		line.y2.baseVal.value = lineData['y2'] || lineData['y'];
		//If some data is not provided, choose default value. The line may be updated later
		line.setAttribute("stroke", lineData.color || "black");
		line.setAttribute("stroke-width", lineData.size || 10);
		line.setAttribute("opacity", Math.max(0.1, Math.min(1, lineData.opacity)) || 1);
		Tools.drawingArea.appendChild(line);
		return line;
	}

	function updateLine(line, data) {
		line.x2.baseVal.value = data['x2'];
		line.y2.baseVal.value = data['y2'];
	}

	var lineTool = {
		"name": "Straight line",
		"shortcut": "l",
		"listeners": {
			"press": startLine,
			"move": continueLine,
			"release": stopLine,
		},
		"secondary": {
			"name": "Straight line",
			"icon": "tools/line/icon-straight.svg",
			"active": false,
		},
		"draw": draw,
		"mouseCursor": "crosshair",
		"icon": "tools/line/icon.svg",
		"stylesheet": "tools/line/line.css"
	};
	Tools.add(lineTool);
})(); //End of code isolation
//==========================================================


/**
 *                        WHITEBOPHIR
 *********************************************************
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2013  Ophir LOJKINE
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend
 */

 (function () { //Code isolation
	//Indicates the id of the shape the user is currently drawing or an empty string while the user is not drawing
	var end = false,
		curId = "",
		curUpdate = { //The data of the message that will be sent for every new point
			'type': 'update',
			'id': "",
			'x': 0,
			'y': 0,
			'x2': 0,
			'y2': 0
		},
		lastTime = performance.now(); //The time at which the last point was drawn

	function start(x, y, evt) {

		//Prevent the press from being interpreted by the browser
		evt.preventDefault();

		curId = Tools.generateUID("r"); //"r" for rectangle

		Tools.drawAndSend({
			'type': 'rect',
			'id': curId,
			'color': Tools.getColor(),
			'size': Tools.getSize(),
			'opacity': Tools.getOpacity(),
			'x': x,
			'y': y,
			'x2': x,
			'y2': y
		});

		curUpdate.id = curId;
		curUpdate.x = x;
		curUpdate.y = y;
	}

	function move(x, y, evt) {
		/*Wait 70ms before adding any point to the currently drawing shape.
		This allows the animation to be smother*/
		if (curId !== "") {
			if (rectangleTool.secondary.active) {
				var dx = x - curUpdate.x;
				var dy = y - curUpdate.y;
				var d = Math.max(Math.abs(dx), Math.abs(dy));
				x = curUpdate.x + (dx > 0 ? d : -d);
				y = curUpdate.y + (dy > 0 ? d : -d);
			}
			curUpdate['x2'] = x; curUpdate['y2'] = y;
			if (performance.now() - lastTime > 70 || end) {
				Tools.drawAndSend(curUpdate);
				lastTime = performance.now();
			} else {
				draw(curUpdate);
			}
		}
		if (evt) evt.preventDefault();
	}

	function stop(x, y) {
		//Add a last point to the shape
		end = true;
		move(x, y);
		end = false;
		curId = "";
	}

	function draw(data) {
		Tools.drawingEvent = true;
		switch (data.type) {
			case "rect":
				createShape(data);
				break;
			case "update":
				var shape = svg.getElementById(data['id']);
				if (!shape) {
					console.error("Straight shape: Hmmm... I received a point of a rect that has not been created (%s).", data['id']);
					createShape({ //create a new shape in order not to loose the points
						"id": data['id'],
						"x": data['x2'],
						"y": data['y2']
					});
				}
				updateShape(shape, data);
				break;
			default:
				console.error("Straight shape: Draw instruction with unknown type. ", data);
				break;
		}
	}

	var svg = Tools.svg;
	function createShape(data) {
		//Creates a new shape on the canvas, or update a shape that already exists with new information
		var shape = svg.getElementById(data.id) || Tools.createSVGElement("rect");
		shape.id = data.id;
		updateShape(shape, data);
		//If some data is not provided, choose default value. The shape may be updated later
		shape.setAttribute("stroke", data.color || "black");
		shape.setAttribute("stroke-width", data.size || 10);
		shape.setAttribute("opacity", Math.max(0.1, Math.min(1, data.opacity)) || 1);
		Tools.drawingArea.appendChild(shape);
		return shape;
	}

	function updateShape(shape, data) {
		shape.x.baseVal.value = Math.min(data['x2'], data['x']);
		shape.y.baseVal.value = Math.min(data['y2'], data['y']);
		shape.width.baseVal.value = Math.abs(data['x2'] - data['x']);
		shape.height.baseVal.value = Math.abs(data['y2'] - data['y']);
	}

	var rectangleTool = {
		"name": "Rectangle",
		"shortcut": "r",
		"listeners": {
			"press": start,
			"move": move,
			"release": stop,
		},
		"secondary": {
			"name": "Square",
			"icon": "tools/rect/icon-square.svg",
			"active": false,
		},
		"draw": draw,
		"mouseCursor": "crosshair",
		"icon": "tools/rect/icon.svg",
		"stylesheet": "tools/rect/rect.css"
	};
	Tools.add(rectangleTool);

})(); //End of code isolation
//==========================================================
/**
 *                        WHITEBOPHIR
 *********************************************************
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2020  Ophir LOJKINE
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend
 */

 (function () { //Code isolation
  var curUpdate = { //The data of the message that will be sent for every new point
      'type': 'update',
      'id': "",
      'x': 0,
      'y': 0,
      'x2': 0,
      'y2': 0
  },
      lastPos = { x: 0, y: 0 },
      lastTime = performance.now(); //The time at which the last point was drawn

  function start(x, y, evt) {

      //Prevent the press from being interpreted by the browser
      evt.preventDefault();

      curUpdate.id = Tools.generateUID("e"); //"e" for ellipse

      Tools.drawAndSend({
          'type': 'ellipse',
          'id': curUpdate.id,
          'color': Tools.getColor(),
          'size': Tools.getSize(),
          'opacity': Tools.getOpacity(),
          'x': x,
          'y': y,
          'x2': x,
          'y2': y
      });

      curUpdate.id = curUpdate.id;
      curUpdate.x = x;
      curUpdate.y = y;
  }

  function move(x, y, evt) {
      if (!curUpdate.id) return; // Not currently drawing
      if (evt) {
          circleTool.secondary.active = circleTool.secondary.active || evt.shiftKey;
          evt.preventDefault(); 
      }
      lastPos.x = x;
      lastPos.y = y;
      doUpdate();
  }

  function doUpdate(force) {
      if (!curUpdate.id) return; // Not currently drawing
      if (drawingCircle()) {
          var x0 = curUpdate['x'], y0 = curUpdate['y'];
          var deltaX = lastPos.x - x0, deltaY = lastPos.y - y0;
          var diameter = Math.max(Math.abs(deltaX), Math.abs(deltaY));
          curUpdate['x2'] = x0 + (deltaX > 0 ? diameter : -diameter);
          curUpdate['y2'] = y0 + (deltaY > 0 ? diameter : -diameter);
      } else {
          curUpdate['x2'] = lastPos.x;
          curUpdate['y2'] = lastPos.y;
      }

      if (performance.now() - lastTime > 70 || force) {
          Tools.drawAndSend(curUpdate);
          lastTime = performance.now();
      } else {
          draw(curUpdate);
      }
  }

  function stop(x, y) {
      lastPos.x = x;
      lastPos.y = y;
      doUpdate(true);
      curUpdate.id = "";
  }

  function draw(data) {
      Tools.drawingEvent = true;
      switch (data.type) {
          case "ellipse":
              createShape(data);
              break;
          case "update":
              var shape = svg.getElementById(data['id']);
              if (!shape) {
                  console.error("Ellipse: Hmmm... I received an update for a shape that has not been created (%s).", data['id']);
                  createShape({ //create a new shape in order not to loose the points
                      "id": data['id'],
                      "x": data['x2'],
                      "y": data['y2']
                  });
              }
              updateShape(shape, data);
              break;
          default:
              console.error("Ellipse: Draw instruction with unknown type. ", data);
              break;
      }
  }

  var svg = Tools.svg;
  function createShape(data) {
      //Creates a new shape on the canvas, or update a shape that already exists with new information
      var shape = svg.getElementById(data.id) || Tools.createSVGElement("ellipse");
      updateShape(shape, data);
      shape.id = data.id;
      //If some data is not provided, choose default value. The shape may be updated later
      shape.setAttribute("stroke", data.color || "black");
      shape.setAttribute("stroke-width", data.size || 10);
      shape.setAttribute("opacity", Math.max(0.1, Math.min(1, data.opacity)) || 1);
      Tools.drawingArea.appendChild(shape);
      return shape;
  }

  function updateShape(shape, data) {
      shape.cx.baseVal.value = Math.round((data['x2'] + data['x']) / 2);
      shape.cy.baseVal.value = Math.round((data['y2'] + data['y']) / 2);
      shape.rx.baseVal.value = Math.abs(data['x2'] - data['x']) / 2;
      shape.ry.baseVal.value = Math.abs(data['y2'] - data['y']) / 2;
  }

  function drawingCircle() {
      return circleTool.secondary.active;
  }

  var circleTool = { //The new tool
      "name": "Ellipse",
      "icon": "tools/ellipse/icon-ellipse.svg",
      "secondary": {
          "name": "Circle",
          "icon": "tools/ellipse/icon-circle.svg",
          "active": false,
          "switch": doUpdate,
      },
      "shortcut": "c",
      "listeners": {
          "press": start,
          "move": move,
          "release": stop,
      },
      "draw": draw,
      "mouseCursor": "crosshair",
      "stylesheet": "tools/ellipse/ellipse.css"
  };
  Tools.add(circleTool);

})(); //End of code isolation
//==============================================

/**
 *                        WHITEBOPHIR
 *********************************************************
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2013  Ophir LOJKINE
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend
 */

 (function () { //Code isolation
	var board = Tools.board;

	var input = document.createElement("input");
	input.id = "textToolInput";
	input.type = "text";
	input.setAttribute("autocomplete", "off");

	var curText = {
		"x": 0,
		"y": 0,
		"size": 36,
		"rawSize": 16,
		"oldSize": 0,
		"opacity": 1,
		"color": "#000",
		"id": 0,
		"sentText": "",
		"lastSending": 0
	};

	var active = false;


	function onStart() {
		curText.oldSize = Tools.getSize();
		Tools.setSize(curText.rawSize);
	}

	function onQuit() {
		stopEdit();
		Tools.setSize(curText.oldSize);
	}

	function clickHandler(x, y, evt, isTouchEvent) {
		//if(document.querySelector("#menu").offsetWidth>Tools.menu_width+3) return;
		if (evt.target === input) return;
		if (evt.target.tagName === "text") {
			editOldText(evt.target);
			evt.preventDefault();
			return;
		}
		curText.rawSize = Tools.getSize();
		curText.size = parseInt(curText.rawSize * 1.5 + 12);
		curText.opacity = Tools.getOpacity();
		curText.color = Tools.getColor();
		curText.x = x;
		curText.y = y + curText.size / 2;

		stopEdit();
		startEdit();
		evt.preventDefault();
	}

	function editOldText(elem) {
		curText.id = elem.id;
		var r = elem.getBoundingClientRect();
		var x = (r.left + document.documentElement.scrollLeft) / Tools.scale;
		var y = (r.top + r.height + document.documentElement.scrollTop) / Tools.scale;

		curText.x = x;
		curText.y = y;
		curText.sentText = elem.textContent;
		curText.size = parseInt(elem.getAttribute("font-size"));
		curText.opacity = parseFloat(elem.getAttribute("opacity"));
		curText.color = elem.getAttribute("fill");
		startEdit();
		input.value = elem.textContent;
	}

	function startEdit() {
		active = true;
		if (!input.parentNode) board.appendChild(input);
		input.value = "";
		var left = curText.x - document.documentElement.scrollLeft + 'px';
		var clientW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var x = curText.x * Tools.scale - document.documentElement.scrollLeft;
		if (x + 250 > clientW) {
			x = Math.max(60, clientW - 260)
		}

		input.style.left = x + 'px';
		input.style.top = curText.y * Tools.scale - document.documentElement.scrollTop + 20 + 'px';
		input.focus();
		input.addEventListener("keyup", textChangeHandler);
		input.addEventListener("blur", textChangeHandler);
		input.addEventListener("blur", blur);
	}

	function stopEdit() {
		try { input.blur(); } catch (e) { /* Internet Explorer */ }
		active = false;
		blur();
		curText.id = 0;
		curText.sentText = "";
		input.value = "";
		input.removeEventListener("keyup", textChangeHandler);
	}

	function blur() {
		if (active) return;
		input.style.top = '-1000px';
	}

	function textChangeHandler(evt) {
		if (evt.which === 13) { // enter
			curText.y += 1.5 * curText.size;
			stopEdit();
			startEdit();
		} else if (evt.which === 27) { // escape
			stopEdit();
		}
		if (performance.now() - curText.lastSending > 100) {
			if (curText.sentText !== input.value) {
				//If the user clicked where there was no text, then create a new text field
				if (curText.id === 0) {
					curText.id = Tools.generateUID("t"); //"t" for text
					Tools.drawAndSend({
						'type': 'new',
						'id': curText.id,
						'color': curText.color,
						'size': curText.size,
						'opacity': curText.opacity,
						'x': curText.x,
						'y': curText.y
					})
				}
				Tools.drawAndSend({
					'type': "update",
					'id': curText.id,
					'txt': input.value.slice(0, 280)
				});
				curText.sentText = input.value;
				curText.lastSending = performance.now();
			}
		} else {
			clearTimeout(curText.timeout);
			curText.timeout = setTimeout(textChangeHandler, 500, evt);
		}
	}

	function draw(data, isLocal) {
		Tools.drawingEvent = true;
		switch (data.type) {
			case "new":
				createTextField(data);
				break;
			case "update":
				var textField = document.getElementById(data.id);
				if (textField === null) {
					console.error("Text: Hmmm... I received text that belongs to an unknown text field");
					return false;
				}
				updateText(textField, data.txt);
				break;
			default:
				console.error("Text: Draw instruction with unknown type. ", data);
				break;
		}
	}

	function updateText(textField, text) {
		textField.textContent = text;
	}

	function createTextField(fieldData) {
		var elem = Tools.createSVGElement("text");
		elem.id = fieldData.id;
		elem.setAttribute("x", fieldData.x);
		elem.setAttribute("y", fieldData.y);
		elem.setAttribute("font-size", fieldData.size);
		elem.setAttribute("fill", fieldData.color);
		elem.setAttribute("opacity", Math.max(0.1, Math.min(1, fieldData.opacity)) || 1);
		if (fieldData.txt) elem.textContent = fieldData.txt;
		Tools.drawingArea.appendChild(elem);
		return elem;
	}

	Tools.add({ //The new tool
		"name": "Text",
		"shortcut": "t",
		"listeners": {
			"press": clickHandler,
		},
		"onstart": onStart,
		"onquit": onQuit,
		"draw": draw,
		"stylesheet": "tools/text/text.css",
		"icon": "tools/text/icon.svg",
		"mouseCursor": "text"
	});

})(); //End of code isolation

//==========================================================
/**
 *                        WHITEBOPHIR
 *********************************************************
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2013  Ophir LOJKINE
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend
 */

 (function eraser() { //Code isolation

	var erasing = false;

	function startErasing(x, y, evt) {
		//Prevent the press from being interpreted by the browser
		evt.preventDefault();
		erasing = true;
		erase(x, y, evt);
	}

	var msg = {
		"type": "delete",
		"id": ""
	};

	function inDrawingArea(elem) {
		return Tools.drawingArea.contains(elem);
	}

	function erase(x, y, evt) {
		// evt.target should be the element over which the mouse is...
		var target = evt.target;
		if (evt.type === "touchmove") {
			// ... the target of touchmove events is the element that was initially touched,
			// not the one **currently** being touched
			var touch = evt.touches[0];
			target = document.elementFromPoint(touch.clientX, touch.clientY);
		}
		if (erasing && target !== Tools.svg && target !== Tools.drawingArea && inDrawingArea(target)) {
			msg.id = target.id;
			Tools.drawAndSend(msg);
		}
	}

	function stopErasing() {
		erasing = false;
	}

	function draw(data) {
		var elem;
		switch (data.type) {
			//TODO: add the ability to erase only some points in a line
			case "delete":
				elem = svg.getElementById(data.id);
				if (elem === null) console.error("Eraser: Tried to delete an element that does not exist.");
				else Tools.drawingArea.removeChild(elem);
				break;
			default:
				console.error("Eraser: 'delete' instruction with unknown type. ", data);
				break;
		}
	}

	var svg = Tools.svg;

	Tools.add({ //The new tool
		"name": "Eraser",
		"shortcut": "e",
		"listeners": {
			"press": startErasing,
			"move": erase,
			"release": stopErasing,
		},
		"draw": draw,
		"icon": "tools/eraser/icon.svg",
		"mouseCursor": "crosshair",
		"showMarker": true,
	});

})(); //End of code isolation

//=================================================================
/**
 *						  WHITEBOPHIR
 *********************************************************
 * @licstart  The following is the entire license notice for the 
 *	JavaScript code in this page.
 *
 * Copyright (C) 2013  Ophir LOJKINE
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend
 */

 (function hand() { //Code isolation
	var selected = null;
	var last_sent = 0;


	function startMovingElement(x, y, evt) {
		//Prevent the press from being interpreted by the browser
		evt.preventDefault();
		if (!evt.target || !Tools.drawingArea.contains(evt.target)) return;
		var tmatrix = get_translate_matrix(evt.target);
		selected = { x: x - tmatrix.e, y: y - tmatrix.f, elem: evt.target };
	}

	function moveElement(x, y) {
		if (!selected) return;
		var deltax = x - selected.x;
		var deltay = y - selected.y;
		var msg = { type: "update", id: selected.elem.id, deltax: deltax, deltay: deltay };
		var now = performance.now();
		if (now - last_sent > 70) {
			last_sent = now;
			Tools.drawAndSend(msg);
		} else {
			draw(msg);
		}
	}

	function get_translate_matrix(elem) {
		// Returns the first translate or transform matrix or makes one
		var translate = null;
		for (var i = 0; i < elem.transform.baseVal.numberOfItems; ++i) {
			var baseVal = elem.transform.baseVal[i];
			// quick tests showed that even if one changes only the fields e and f or uses createSVGTransformFromMatrix
			// the brower may add a SVG_TRANSFORM_MATRIX instead of a SVG_TRANSFORM_TRANSLATE
			if (baseVal.type === SVGTransform.SVG_TRANSFORM_TRANSLATE || baseVal.type === SVGTransform.SVG_TRANSFORM_MATRIX) {
				translate = baseVal;
				break;
			}
		}
		if (translate == null) {
			translate = elem.transform.baseVal.createSVGTransformFromMatrix(Tools.svg.createSVGMatrix());
			elem.transform.baseVal.appendItem(translate);
		}
		return translate.matrix;
	}

	function draw(data) {
		switch (data.type) {
			case "update":
				var elem = Tools.svg.getElementById(data.id);
				if (!elem) throw new Error("Mover: Tried to move an element that does not exist.");
				var tmatrix = get_translate_matrix(elem);
				tmatrix.e = data.deltax || 0;
				tmatrix.f = data.deltay || 0;
				break;

			default:
				throw new Error("Mover: 'move' instruction with unknown type. ", data);
		}
	}

	function startHand(x, y, evt, isTouchEvent) {
		if (!isTouchEvent) {
			selected = {
				x: document.documentElement.scrollLeft + evt.clientX,
				y: document.documentElement.scrollTop + evt.clientY,
			}
		}
	}
	function moveHand(x, y, evt, isTouchEvent) {
		if (selected && !isTouchEvent) { //Let the browser handle touch to scroll
			window.scrollTo(selected.x - evt.clientX, selected.y - evt.clientY);
		}
	}

	function press(x, y, evt, isTouchEvent) {
		if (!handTool.secondary.active) startHand(x, y, evt, isTouchEvent);
		else startMovingElement(x, y, evt, isTouchEvent);
	}


	function move(x, y, evt, isTouchEvent) {
		if (!handTool.secondary.active) moveHand(x, y, evt, isTouchEvent);
		else moveElement(x, y, evt, isTouchEvent);
	}

	function release(x, y, evt, isTouchEvent) {
		move(x, y, evt, isTouchEvent);
		selected = null;
	}

	function switchTool() {
		selected = null;
	}

	var handTool = { //The new tool
		"name": "Hand",
		"shortcut": "h",
		"listeners": {
			"press": press,
			"move": move,
			"release": release,
		},
		"secondary": {
			"name": "Mover",
			"icon": "tools/hand/mover.svg",
			"active": false,
			"switch": switchTool,
		},
		"draw": draw,
		"icon": "tools/hand/hand.svg",
		"mouseCursor": "move",
		"showMarker": true,
	};
	Tools.add(handTool);
	Tools.change("Hand"); // Use the hand tool by default
})(); //End of code isolation
//===================================================
/**
 *                        WHITEBOPHIR
 *********************************************************
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2020  Ophir LOJKINE
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend
 */

 (function grid() { //Code isolation

  var index = 0; //grid off by default
  var states = ["none", "url(#grid)", "url(#dots)"];

  function toggleGrid(evt) {
      index = (index + 1) % states.length;
      gridContainer.setAttributeNS(null, "fill", states[index]);
  }

  function createPatterns() {
      // create patterns
      // small (inner) grid
      var smallGrid = Tools.createSVGElement("pattern", {
          id: "smallGrid",
          width: "30",
          height: "30",
          patternUnits: "userSpaceOnUse"
      });
      smallGrid.appendChild(
          Tools.createSVGElement("path", {
              d: "M 30 0 L 0 0 0 30",
              fill: "none",
              stroke: "gray",
              'stroke-width': "0.5"
          })
      );
      // (outer) grid
      var grid = Tools.createSVGElement("pattern", {
          id: "grid",
          width: "300",
          height: "300",
          patternUnits: "userSpaceOnUse"
      });
      grid.appendChild(Tools.createSVGElement("rect", {
          width: "300",
          height: "300",
          fill: "url(#smallGrid)"
      }));
      grid.appendChild(
          Tools.createSVGElement("path", {
              d: "M 300 0 L 0 0 0 300",
              fill: "none",
              stroke: "gray", 'stroke-width': "1"
          })
      );
      // dots
      var dots = Tools.createSVGElement("pattern", {
          id: "dots",
          width: "30",
          height: "30",
          x: "-10",
          y: "-10",
          patternUnits: "userSpaceOnUse"
      });
      dots.appendChild(Tools.createSVGElement("circle", {
          fill: "gray",
          cx: "10",
          cy: "10",
          r: "2"
      }));

      var defs = Tools.svg.getElementById("defs");
      defs.appendChild(smallGrid);
      defs.appendChild(grid);
      defs.appendChild(dots);
  }

  var gridContainer = (function init() {
      // initialize patterns
      createPatterns();
      // create grid container
      var gridContainer = Tools.createSVGElement("rect", {
          id: "gridContainer",
          width: "100%", height: "100%",
          fill: states[index]
      });
      Tools.svg.insertBefore(gridContainer, Tools.drawingArea);
      return gridContainer;
  })();

  Tools.add({ //The new tool
      "name": "Grid",
      "shortcut": "g",
      "listeners": {},
      "icon": "tools/grid/icon.svg",
      "oneTouch": true,
      "onstart": toggleGrid,
      "mouseCursor": "crosshair",
  });

})(); //End of code isolation
//=====================================================
/**
 *                        WHITEBOPHIR
 *********************************************************
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2013  Ophir LOJKINE
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend
 */

 (function () { //Code isolation
  var ZOOM_FACTOR = .5;
  var origin = {
      scrollX: document.documentElement.scrollLeft,
      scrollY: document.documentElement.scrollTop,
      x: 0.0,
      y: 0.0,
      clientY: 0,
      scale: window.innerWidth/1500
  };
  var moved = false, pressed = false;

  function zoom(origin, scale) {
      var oldScale = origin.scale;
      var newScale = Tools.setScale(scale);
      window.scrollTo(
          origin.scrollX + origin.x * (newScale - oldScale),
          origin.scrollY + origin.y * (newScale - oldScale)
      );
  }

  var animation = null;
  function animate(scale) {
      cancelAnimationFrame(animation);
      animation = requestAnimationFrame(function () {
          zoom(origin, scale);
      });
  }

  function setOrigin(x, y, evt, isTouchEvent) {
      origin.scrollX = document.documentElement.scrollLeft;
      origin.scrollY = document.documentElement.scrollTop;
      origin.x = x;
      origin.y = y;
      origin.clientY = getClientY(evt, isTouchEvent);
      origin.scale = Tools.getScale();
  }

  function press(x, y, evt, isTouchEvent) {
      evt.preventDefault();
      setOrigin(x, y, evt, isTouchEvent);
      moved = false;
      pressed = true;
  }

  function move(x, y, evt, isTouchEvent) {
      if (pressed) {
          evt.preventDefault();
          var delta = getClientY(evt, isTouchEvent) - origin.clientY;
          var scale = origin.scale * (1 + delta * ZOOM_FACTOR / 100);
          if (Math.abs(delta) > 1) moved = true;
          animation = animate(scale);
      }
  }

  function onwheel(evt) {
      evt.preventDefault();
      var multiplier =
          (evt.deltaMode === WheelEvent.DOM_DELTA_LINE) ? 30 :
              (evt.deltaMode === WheelEvent.DOM_DELTA_PAGE) ? 1000 :
                  1;
      var deltaX = evt.deltaX * multiplier, deltaY = evt.deltaY * multiplier;
      if (!evt.ctrlKey) {
          // zoom
          var scale = Tools.getScale();
          var x = evt.pageX / scale;
          var y = evt.pageY / scale;
          setOrigin(x, y, evt, false);
          animate((1 - deltaY / 800) * Tools.getScale());
      } else if (evt.altKey) {
          // make finer changes if shift is being held
          var change = evt.shiftKey ? 1 : 5;
          // change tool size
          Tools.setSize(Tools.getSize() - deltaY / 100 * change);
      } else if (evt.shiftKey) {
          // scroll horizontally
          window.scrollTo(document.documentElement.scrollLeft + deltaY, document.documentElement.scrollTop + deltaX);
      } else {
          // regular scrolling
          window.scrollTo(document.documentElement.scrollLeft + deltaX, document.documentElement.scrollTop + deltaY);
      }
  }
  Tools.board.addEventListener("wheel", onwheel, { passive: false });

  Tools.board.addEventListener("touchmove", function ontouchmove(evt) {
      // 2-finger pan to zoom
      var touches = evt.touches;
      if (touches.length === 2) {
          var x0 = touches[0].clientX, x1 = touches[1].clientX,
              y0 = touches[0].clientY, y1 = touches[1].clientY,
              dx = x0 - x1,
              dy = y0 - y1;
          var x = (touches[0].pageX + touches[1].pageX) / 2 / Tools.getScale(),
              y = (touches[0].pageY + touches[1].pageY) / 2 / Tools.getScale();
          var distance = Math.sqrt(dx * dx + dy * dy);
          if (!pressed) {
              pressed = true;
              setOrigin(x, y, evt, true);
              origin.distance = distance;
          } else {
              var delta = distance - origin.distance;
              var scale = origin.scale * (1 + delta * ZOOM_FACTOR / 100);
              animate(scale);
          }
      }
  }, { passive: true });
  function touchend() {
      pressed = false;
  }
  Tools.board.addEventListener("touchend", touchend);
  Tools.board.addEventListener("touchcancel", touchend);

  function release(x, y, evt, isTouchEvent) {
      if (pressed && !moved) {
          var delta = (evt.shiftKey === true) ? -1 : 1;
          var scale = Tools.getScale() * (1 + delta * ZOOM_FACTOR);
          zoom(origin, scale);
      }
      pressed = false;
  }

  function key(down) {
      return function (evt) {
          if (evt.key === "Shift") {
              Tools.svg.style.cursor = "zoom-" + (down ? "out" : "in");
          }
      }
  }

  function getClientY(evt, isTouchEvent) {
      return isTouchEvent ? evt.changedTouches[0].clientY : evt.clientY;
  }

  var keydown = key(true);
  var keyup = key(false);

  function onstart() {
      window.addEventListener("keydown", keydown);
      window.addEventListener("keyup", keyup);
  }
  function onquit() {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
  }

  var zoomTool = {
      "name": "Zoom",
      "shortcut": "z",
      "listeners": {
          "press": press,
          "move": move,
          "release": release,
      },
      "onstart": onstart,
      "onquit": onquit,
      "mouseCursor": "zoom-in",
      "icon": "tools/zoom/icon.svg",
      "helpText": "click_to_zoom",
      "showMarker": true,
  };
  Tools.add(zoomTool);
})(); //End of code isolation
//======================================================

  }
  render() {
    return (
      <div>
    <div id="board">
      <svg id="canvas" width="500" height="500" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs id="defs"></defs>
        <g id="drawingArea"></g>
        <g id="cursors"></g>
      </svg>
    </div>
  
    <div id="loadingMessage">Loading...</div>
  
    <div id="menu" >
      <div id="menuItems">
        <ul id="tools" className="tools">
          <li className="tool" tabIndex="-1">
            <img className="tool-icon" width="35" height="35" src="" alt="icon" />
            <span className="tool-name"></span>
            <img className="tool-icon secondaryIcon" width="35" height="35" src="data:," alt="icon" />
          </li>
        </ul>
  
        <ul className="tools" id="settings">
          <li className="tool" tabIndex="-1">
            <input className="tool-icon" type="color" id="chooseColor" value="#1913B0" />
            {/* <label className="tool-name" htmlFor="chooseColor">{{translations.color}}</label> */}
            <span className="colorPresets" id="colorPresetSel">
              <span className="colorPresetButton"></span>
            </span>
          </li>
          <li className="tool" tabIndex="-1"
            title="{{translations.size}} ({{translations.keyboard_shortcut}}: alt + {{translations.mousewheel}})">
            <img className="tool-icon" width="60" height="60" src="icon-size.svg" alt="size" />
            <label className="tool-name slider" htmlFor="chooseSize">
              {/* <span>{{translations.size}}</span> */}
              <input type="range" id="chooseSize" value="4" min="1" max="50" step="1" className="rangeChooser" />
            </label>
          </li>
          <li className="tool" tabIndex="-1">
            <span className="tool-icon">
              {/* <svg viewBox="0 0 8 8">
                <pattern id="opacityPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                  <rect x=0 y=0 width=2 height=2 fill=black></rect>
                  <rect x=2 y=2 width=2 height=2 fill=black></rect>
                  <rect x=2 y=0 width=2 height=2 fill=#eeeeee></rect>
                  <rect x=0 y=2 width=2 height=2 fill=#eeeeee></rect>
                </pattern>
                <circle cx=4 cy=4 id="opacityIndicator" r=3.5 fill="url(#opacityPattern)"></circle>
              </svg> */}
              <CircleIcon/>
            </span>
            <label className="tool-name slider" htmlFor="chooseOpacity">
              {/* <span>{{translations.opacity}}</span> */}
              <input type="range" id="chooseOpacity" value="1" min="0.2" max="1" step="0.1"
                className="rangeChooser" />
            </label>
          </li>
        </ul>
      </div> 
      </div>
      </div>
    )
  }
}

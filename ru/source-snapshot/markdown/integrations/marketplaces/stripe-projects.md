> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем продолжить изучение.

<div id="stripe-projects">
  # Stripe Projects
</div>

> Интегрируйте Exa прямо из терминала с помощью Stripe Projects CLI.

[Stripe Projects](https://projects.dev) позволяет вам и вашим кодинг-агентам подключать сторонние сервисы прямо из терминала — без панелей управления и копирования ключей вручную. Одна команда создаёт аккаунт Exa и синхронизирует API-ключ с вашим проектом.

<div id="prerequisites">
  ## Предварительные требования
</div>

Установите Stripe CLI и плагин Projects:

```bash theme={null}
brew install stripe/stripe-cli/stripe && stripe plugin install projects
```

Информацию о других платформах и полной настройке CLI см. в [Stripe Projects](https://projects.dev).

<div id="get-started">
  ## Начало работы
</div>

В каталоге вашего проекта инициализируйте проект, добавьте Exa и получите учётные данные:

```bash theme={null}
stripe projects init
stripe projects add exa/api
stripe projects env --pull
```

Теперь ваш файл `.env` содержит `EXA_API_KEY`. [SDK Exa](/ru/docs/sdks/quickstart) и [Быстрый старт](/ru/docs/search/quickstart) считывают эту переменную автоматически, поэтому ваш код будет работать без каких-либо изменений.

<Info>
  Ключ создаётся в вашем собственном аккаунте Exa. Управлять использованием, ключами и оплатой можно в любой момент в [панели управления Exa](https://dashboard.exa.ai).
</Info>

<div id="link-an-existing-exa-team">
  ## Привязка существующей команды Exa
</div>

Уже есть аккаунт Exa? Сначала подключите его, чтобы API-ключ был создан в вашей существующей команде:

```bash theme={null}
stripe projects link exa
stripe projects add exa/api
```

`stripe projects link` открывает Exa, чтобы вы могли пройти аутентификацию и связать свою команду с аккаунтом Stripe. Открыть связанную панель управления Exa можно в любой момент командой `stripe projects open exa`.

<div id="provision-from-your-coding-agent">
  ## Провижининг из вашего кодинг-агента
</div>

`stripe projects init` добавляет в ваш проект [Agent Skill](https://projects.dev) для Stripe Projects, так что ваш агент (Claude Code, Cursor, Codex и другие) может выполнить весь процесс за вас:

```text theme={null}
Используй Stripe Projects, чтобы добавить Exa и настроить API-ключ.
```

<div id="next-steps">
  ## Дальнейшие шаги
</div>

* [Быстрый старт](/ru/docs/search/quickstart): выполните свой первый поиск Exa с помощью наших SDK.
* [Документация Stripe Projects](https://docs.stripe.com/projects): полный справочник по CLI, окружениям и биллингу.
* [Панель управления Exa](https://dashboard.exa.ai): управление API-ключами, использованием и биллингом.
* [Каталог провайдеров](https://projects.dev): все провайдеры Stripe Projects.
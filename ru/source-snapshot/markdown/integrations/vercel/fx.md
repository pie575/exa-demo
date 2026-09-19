> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем продолжить изучение.

<div id="fx-by-vercel-labs">
  # fx от Vercel Labs
</div>

> Добавьте веб-поиск Exa в fx, нативный кодинг-агент от Vercel Labs, с помощью хостируемого MCP-сервера Exa.

[fx](https://fx.sh) — это нативный кодинг-агент и CLI от Vercel Labs, а также MCP-клиент. Подключите хостируемый MCP-сервер Exa, чтобы агент мог выполнять поиск в вебе в реальном времени и читать страницы.

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/vercel/fx/install-exa.gif?s=2e331148abdf5bdf083e6f651e3b8b75" alt="Установка fx, добавление MCP-сервера Exa командой /mcp add и выполнение веб-поиска Exa в реальном времени" style={{width: "100%", height: "auto"}} width="800" height="393" data-path="images/integrations/vercel/fx/install-exa.gif" />
</Frame>

<div id="installation">
  ## Установка
</div>

<Steps>
  <Step title="Установите fx">
    ```bash theme={null}
    curl -fsSL https://fx.sh/setup.sh | bash
    ```

    Затем войдите с помощью команды `fx login`. Варианты провайдеров описаны в [документации fx](https://fx.sh/docs).
  </Step>

  <Step title="Добавьте Exa">
    Запустите fx командой `fx`, затем добавьте MCP-сервер Exa из интерактивной оболочки:

    ```text theme={null}
    /mcp add --transport http exa https://mcp.exa.ai/mcp
    ```

    fx сохранит сервер в `~/.fx/mcp.json` и перезагрузит MCP.
  </Step>

  <Step title="Проверьте подключение">
    ```text theme={null}
    /mcp list
    ```
  </Step>
</Steps>

<div id="configure-by-hand">
  ## Настройка вручную
</div>

fx читает MCP-серверы только из `~/.fx/mcp.json`, поэтому вы можете добавить Exa прямо туда:

```json ~/.fx/mcp.json theme={null}
{
  "mcp": {
    "exa": {
      "type": "http",
      "url": "https://mcp.exa.ai/mcp"
    }
  }
}
```

Выполните `/mcp reload`, чтобы применить изменения без перезапуска fx.

Бесплатного тарифа хватит для нерегулярного использования. Чтобы повысить лимиты частоты запросов, создайте API key и добавьте его в конфигурацию:

<Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Создайте key в панели управления. Новым аккаунтам начисляются бесплатные credits.
</Card>

```json ~/.fx/mcp.json theme={null}
{
  "mcp": {
    "exa": {
      "type": "http",
      "url": "https://mcp.exa.ai/mcp",
      "header_env": {
        "x-api-key": "EXA_API_KEY"
      }
    }
  }
}
```

`header_env` сопоставляет имя header с переменной окружения, благодаря чему key не попадает в файл конфигурации.

<div id="tool-discovery">
  ## Обнаружение инструментов
</div>

fx обнаруживает инструменты MCP лениво: инструменты сервера не попадают в контекст модели до того шага, на котором они действительно нужны, поэтому подключение Exa ничего не стоит на тех шагах, где поиск в интернете не требуется.

<Card title="Exa MCP" icon="plug" href="/ru/docs/get-started/exa-mcp" cta="Открыть руководство" arrow="true">
  Ознакомьтесь с доступными инструментами, параметрами настройки и другими клиентами.
</Card>
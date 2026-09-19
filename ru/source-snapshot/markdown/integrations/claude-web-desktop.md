> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем изучать документацию дальше.

<div id="exa-in-claude-code-web-and-desktop">
  # Exa в Claude Code, Web и Desktop
</div>

> Ищите в интернете и читайте любые страницы с помощью Exa прямо из Claude

Установите Exa в Claude Code или подключите его к Claude Web, Desktop и Cowork, чтобы открыть Claude доступ к актуальной информации из интернета. Claude может искать на естественном языке, читать нужные страницы и опираться на эти источники в работе.

<div id="install-exa">
  ## Установка Exa
</div>

<div className="docs-tabs">
  <Tabs>
    <Tab title="Claude Web, Desktop и Cowork" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
      <Steps>
        <Step title="Откройте каталог коннекторов">
          В новом чате Claude нажмите кнопку с плюсом, выберите **Add connector** и найдите **Exa**.
        </Step>

        <Step title="Подключите Exa">
          Откройте Exa, выберите **Connect to Claude** и подтвердите доступ по запросу.

          <Frame caption="Открытие каталога коннекторов в Claude, поиск Exa, подключение и предоставление доступа">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="Открытие каталога коннекторов в Claude, поиск Exa, подключение и предоставление доступа" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
          </Frame>
        </Step>

        <Step title="Используйте Exa">
          Начните новый чат и задайте вопрос, для ответа на который нужна актуальная информация из интернета.
        </Step>
      </Steps>
    </Tab>

    <Tab title="Claude Code CLI" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude-code.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=f7f017b187974c56e5822d7baf8272fa" width="16" height="16" data-path="images/mcp-clients/claude-code.svg">
      <Steps>
        <Step title="Установите плагин">
          Установите Exa из терминала:

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          Также можно ввести `/plugin` в Claude Code, найти **Exa** и установить его.
        </Step>

        <Step title="Начните новую сессию">
          Откройте новую сессию Claude Code, чтобы плагин загрузился, и задайте вопрос, для ответа на который нужен интернет.

          <Frame caption="Открытие новой сессии Claude Code и запрос, для которого нужен интернет">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/claude-code.gif?s=1a6d69ab819e600fd2101771380a5711" alt="Открытие новой сессии Claude Code и запрос, для которого нужен интернет" style={{width: "100%", height: "auto"}} width="800" height="502" data-path="images/integrations/claude-web-desktop/claude-code.gif" />
          </Frame>
        </Step>
      </Steps>
    </Tab>
  </Tabs>
</div>

Оба варианта дают доступ к Exa без редактирования файла настроек MCP.

<div id="work-with-whats-on-the-web-right-now">
  ## Работайте с тем, что есть в сети прямо сейчас
</div>

В Claude Code Exa может искать актуальную документацию, issues, списки изменений и реальные примеры кода прямо во время работы в вашем репозитории. Та же интеграция даёт Claude Web, Desktop и Cowork доступ к свежим новостям, исследованиям, информации о компаниях, сведениям о продуктах и другим источникам, которых может не быть в контексте.

```text theme={null}
Мы используем Tailwind v3. С помощью Exa найди и прочитай официальное
руководство по обновлению до Tailwind v4, затем переведи этот проект на v4.
```

Claude Code может использовать найденное, чтобы внести изменения в вашу кодовую базу. В других клиентах Claude те же источники используются в ответах, артефактах и задачах Cowork.

Тот же подход работает всякий раз, когда ответ зависит от актуальных или конкретных веб-источников:

* «Найди последние заметки о выпуске этой зависимости и кратко изложи ломающие изменения».
* «Найди свежие первичные исследования по масштабированию во время инференса и сравни методы».
* «Прочитай актуальную документацию по вебхукам Stripe и объясни рекомендуемое поведение при повторных попытках».
* «Найди официальные страницы с ценами на эти продукты и сравни их начальные тарифы».

<div id="search-read-and-research">
  ## Поиск, чтение и исследование
</div>

Интеграция Exa даёт Claude инструменты для поиска и чтения веб-страниц, которые он может комбинировать в рамках长 продолжительной исследовательской задачи.

<Columns cols={3}>
  <Card title="Поиск" icon="search">
    Ищите на естественном языке и получайте релевантное содержимое страниц, а не просто список ссылок.
  </Card>

  <Card title="Чтение" icon="file-text">
    Читайте указанную вами страницу: документацию, исследования, списки изменений, issues и статьи.
  </Card>

  <Card title="Исследование" icon="compass">
    Выполняйте несколько поисковых запросов, изучайте полезные страницы и объединяйте найденное в ответ со ссылками на источники.
  </Card>
</Columns>

<div id="research-without-leaving-claude">
  ## Исследования, не покидая Claude
</div>

Опишите нужный результат и укажите Claude, какие источники важны:

```text theme={null}
Сравни управляемые сервисы, лицензирование и цены основных
векторных баз данных с открытым исходным кодом. Используй актуальные
первоисточники и указывай ссылки на них.
```

Claude может использовать Exa на протяжении всего диалога, чтобы находить и читать источники, необходимые для решения задачи. Подойдёт для технических исследований, конкурентного анализа, анализа рынка, изучения компаний и любых вопросов, ответы на которые разбросаны по всему интернету.

<div id="use-exa-in-cowork">
  ## Использование Exa в Cowork
</div>

Тот же коннектор доступен и в Cowork. Поставьте Claude задачу, требующую внешней информации, — и он сможет искать и читать страницы, параллельно работая с вашими файлами и другими подключёнными инструментами.

```text theme={null}
Проверь этот обзор конкурентов, сверь каждое утверждение о ценах с
актуальными страницами поставщиков с помощью Exa и дополни документ ссылками на источники.
```

<div id="prefer-mcp-directly">
  ## Предпочитаете подключаться к MCP напрямую?
</div>

Если вы настраиваете Claude вручную или используете другой MCP-клиент, вы можете подключиться напрямую к хостируемому MCP-серверу Exa:

```bash theme={null}
claude mcp add --transport http exa https://mcp.exa.ai/mcp
```

Информацию о других клиентах, параметрах настройки и доступных инструментах см. в разделе [Exa MCP](/ru/docs/get-started/exa-mcp).

<Card title="Открыть коннектор Exa" icon="external-link" horizontal href="https://claude.ai/connectors/exa">
  Добавьте Exa в каталоге коннекторов Claude.
</Card>
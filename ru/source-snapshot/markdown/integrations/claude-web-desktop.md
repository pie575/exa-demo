> ## Индекс документации {#documentation-index}
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц перед дальнейшим изучением.

# Exa в Claude Code, Web и Desktop {#exa-in-claude-code-web-and-desktop}

> Ищите в интернете и читайте любые страницы с помощью Exa прямо из Claude

Установите Exa в Claude Code или подключите его к Claude Web, Desktop и Cowork, чтобы открыть Claude доступ к актуальной информации из интернета. Claude сможет искать на естественном языке, читать действительно нужные страницы и опираться на эти источники в работе.

## Установка Exa {#install-exa}

<div className="docs-tabs">
  <Tabs>
    <Tab title="Claude Web, Desktop и Cowork" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
      <Steps>
        <Step title="Откройте каталог коннекторов">
          В новом чате Claude нажмите кнопку с плюсом, выберите **Add connector** и найдите **Exa**.
        </Step>

        <Step title="Подключите Exa">
          Откройте Exa, выберите **Connect to Claude** и предоставьте доступ по запросу.

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

Оба варианта подключают Exa без правки файла настроек MCP.

## Работайте с тем, что есть в вебе прямо сейчас {#work-with-whats-on-the-web-right-now}

В Claude Code Exa может искать актуальную документацию, issues, журналы изменений и примеры из реальной практики прямо во время работы в вашем репозитории. Эта же интеграция даёт Claude Web, Desktop и Cowork доступ к свежим новостям, исследованиям, информации о компаниях, сведениям о продуктах и другим источникам, которых может не быть в контексте.

```text theme={null}
Мы используем Tailwind v3. С помощью Exa найди и прочитай официальное
руководство по обновлению до Tailwind v4, затем переведи этот проект на v4.
```

Claude Code может использовать найденное, чтобы внести изменения в вашу кодовую базу. В других клиентах Claude те же источники могут использоваться в ответах, артефактах и задачах Cowork.

Этот же подход работает везде, где ответ зависит от актуальных или конкретных веб-источников:

* «Найди последние заметки о релизе этой зависимости и кратко изложи обратно несовместимые изменения».
* «Найди свежие первичные исследования по масштабированию на этапе вывода и сравни методы».
* «Прочитай актуальную документацию по вебхукам Stripe и объясни рекомендуемое поведение при повторных попытках».
* «Найди официальные страницы с ценами на эти продукты и сравни их начальные тарифы».

## Поиск, чтение и исследование {#search-read-and-research}

Интеграция Exa даёт Claude инструменты для поиска и чтения веб-страниц, которые он может сочетать в рамках объёмной исследовательской задачи.

<Columns cols={3}>
  <Card title="Поиск" icon="search">
    Ищите на естественном языке и получайте релевантное содержимое страниц, а не просто список ссылок.
  </Card>

  <Card title="Чтение" icon="file-text">
    Читайте указанную вами страницу: документацию, исследования, журналы изменений, issues и статьи.
  </Card>

  <Card title="Исследование" icon="compass">
    Выполняйте несколько поисков, изучайте полезные страницы и объединяйте данные в ответ со ссылками на источники.
  </Card>
</Columns>

## Исследования, не покидая Claude {#research-without-leaving-claude}

Опишите нужный результат и укажите Claude, какие источники для вас важны:

```text theme={null}
Сравни управляемые сервисы, лицензирование и цены основных
open source векторных баз данных. Используй актуальные первоисточники и ссылайся на них.
```

Claude может обращаться к Exa на протяжении всего диалога, чтобы находить и читать источники, необходимые для задачи. Используйте это для технических исследований, конкурентного анализа, анализа рынка, изучения компаний или любого вопроса, ответ на который разбросан по вебу.

## Использование Exa в Cowork {#use-exa-in-cowork}

Тот же коннектор доступен и в Cowork. Поставьте Claude задачу, для которой нужна внешняя информация, и он сможет искать и читать страницы, одновременно работая с вашими файлами и другими подключёнными tools.

```text theme={null}
Изучи этот конкурентный обзор, проверь каждое утверждение о ценах по
актуальным страницам вендоров с помощью Exa и дополни документ ссылками на источники.
```

## Предпочитаете подключиться к MCP напрямую? {#prefer-mcp-directly}

Если вы настраиваете Claude вручную или используете другой MCP-клиент, можно подключиться напрямую к хостируемому MCP-серверу Exa:

```bash theme={null}
claude mcp add --transport http exa https://mcp.exa.ai/mcp
```

Информация о других клиентах, параметрах настройки и доступных инструментах приведена в разделе [Exa MCP](/ru/docs/get-started/exa-mcp).

<Card title="Открыть коннектор Exa" icon="external-link" horizontal href="https://claude.ai/connectors/exa">
  Добавьте Exa в каталоге коннекторов Claude.
</Card>
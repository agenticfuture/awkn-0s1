# Prompt

```text
    - domains:
        - domain_name:
            -caps: (capabilities)
                - ui/
                - shared/
                - common/
                - utils/
                - workflows/
                - api
                - entities
                - functions
                - cap_processor: a class to wrap all the workflows or the main workflow used by the cap
                - adapters/
                    - db 
                - .env: to set the db url for instance or to see the type of specific .env vars used by the cap
            - domain_processor: a class to wrap all the caps used by the domain
            - domain_api: an aggregator of all the apis used by caps
            - domain_ui: a shell to combine all the shells used by the caps
        - ...
        - admin: an admin_domain to handle the necessary of the app administration
        - project_name
    also add this structure too with an example inside...Let's code it in typescript
```

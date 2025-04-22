
import { Provider } from 'jotai'

export const Providers = ({ children }: { children: any }) => {
    return (
        <Provider>
            {children}
        </Provider>
    )
}
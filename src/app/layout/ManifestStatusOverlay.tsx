import Link from "next/link"
import styled, { keyframes } from "styled-components"

export const ManifestStatusOverlay = (
    props:
        | {
              status: "bungie-loading" | "dexie-loading"
          }
        | {
              status: "bungie-error"
              error: Error
          }
        | {
              status: "dexie-error"
              error: Error | Error[]
          }
) => {
    switch (props.status) {
        case "bungie-loading":
            return (
                <StyledManifestStatusOverlay>
                    <OverlayContainer>
                        <SpinnerIcon $type="bungie" />
                    </OverlayContainer>
                </StyledManifestStatusOverlay>
            )
        case "dexie-loading":
            return (
                <StyledManifestStatusOverlay>
                    <OverlayContainer>
                        <SpinnerIcon $type="dexie" />
                    </OverlayContainer>
                </StyledManifestStatusOverlay>
            )
        case "bungie-error":
            return (
                <StyledManifestStatusOverlay>
                    <OverlayContainer>
                        <ErrorMesssage>
                            Bungie.net manifest failed to load: {props.error.message}
                        </ErrorMesssage>
                    </OverlayContainer>
                </StyledManifestStatusOverlay>
            )
        case "dexie-error":
            return (
                <StyledManifestStatusOverlay>
                    <OverlayContainer>
                        <ErrorMesssage>
                            <div style={{ marginBottom: "1rem" }}>
                                Failed to save manifest definitions:{" "}
                                {Array.isArray(props.error) ? (
                                    <ul>
                                        {props.error.map((e, idx) => (
                                            <li key={idx}>{e.message}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    props.error.message
                                )}
                            </div>
                            <div>
                                Please try refreshing the page. If that does not work, please
                                contact us at{" "}
                                <Link
                                    href="https://discord.gg/raidhub"
                                    target="_blank"
                                    style={{ color: "lightblue" }}>
                                    discord.gg/raidhub
                                </Link>
                                .
                            </div>
                        </ErrorMesssage>
                    </OverlayContainer>
                </StyledManifestStatusOverlay>
            )
    }
}

const StyledManifestStatusOverlay = styled.aside`
    pointer-events: none;
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 10;
`

const OverlayContainer = styled.div`
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    justify-content: flex-end;
`

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const SpinnerIcon = styled.div<{
    $type: "bungie" | "dexie"
}>`
    border: 4px solid rgba(100, 100, 100, 0.3);
    border-top: 4px solid
        color-mix(
            in srgb,
            ${({ theme, $type }) => ($type === "bungie" ? theme.colors.icon.orange : "#3498db")},
            #0000 10%
        );
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: ${rotate} 1s linear infinite; /* Animation to rotate the spinner */
`

const ErrorMesssage = styled.div`
    background-color: ${({ theme }) => theme.colors.background.error};
    padding: 1rem;
    max-width: calc(min(50%, 300px));
`

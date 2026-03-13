import InputPane from '../../components/InputPane'
import OutputPane from '../../components/OutputPane'
import Gutter from '../../components/Gutter'
import ControlsPanel from '../../components/ControlsPanel'
import StatusBar from '../../components/StatusBar'
import UploadModal from '../../components/UploadModal'
import Toast from '../../components/Toast'
import Tooltip from '../../components/Tooltip'

export default function JsonFormatter() {
  return (
    <div className="json-formatter-page">
      <main className="layout">
        <div className="panes">
          <InputPane />
          <Gutter />
          <OutputPane />
        </div>

        <ControlsPanel />
        <StatusBar />
      </main>

      <UploadModal />
      <Toast />
      <Tooltip />
    </div>
  )
}


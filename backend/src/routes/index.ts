import { Router } from 'react';
import * as evidenceController from '../controllers/evidence.controller';

const router = Router();

// Evidence routes
router.post('/evidence', evidenceController.submitEvidence);
router.get('/evidence', evidenceController.getEvidence);
router.get('/evidence/:id', evidenceController.getEvidenceById);

export default router;
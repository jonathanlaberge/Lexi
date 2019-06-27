<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminController extends Controller
{
    public function __construct()
    {
		$this->middleware('auth');
    }

    public function CategorieCreation(Request $request)
    {
		$body = json_decode($request->getContent());

		if (!isset($body->nom, $body->matiere, $body->niveau, $body->estPublic))
            return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
            
		$nom = $body->nom;
		$matiere = $body->matiere;
		$niveau = $body->niveau;
		$estPublic = $body->estPublic;

		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];

		DB::insert('
			INSERT INTO `categorie`
			(`nom`, `matiere`, `niveau`, `estPublic`, `idMaitresseCreatrice`)
			VALUES (?,?,?,?,?)', [$nom, $matiere, $niveau, $estPublic, $idMaitresseCreatrice]);

		return response()->json(["code" => "200", "message" => "OK"], 200);
    }

    public function CategorieDelete(Request $request, $idCategorie)
    {
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];

		if (!$this->IsValidID($idCategorie))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		$result = DB::delete('DELETE FROM `categorie` WHERE `idCategorie` =? AND `idMaitresseCreatrice` =?', [$idCategorie, $idMaitresseCreatrice]);

		if ($result == 0)
			return response()->json(["code" => "404", "message" => "Data Not Found"], 404);

		return response()->json(["code" => "200", "message" => "OK"], 200);
    }

    public function CategorieGet(Request $request, $idCategorie)
    {
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];

        if (!$this->IsValidID($idCategorie))
            return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

        $result = DB::select('
            SELECT * FROM `categorie`
            WHERE (`idCategorie` = ?) AND
			(`estPublic` = 1 OR `idMaitresseCreatrice` =?)',
            [$idCategorie, $idMaitresseCreatrice]);

        if ($result == null)
        {
            return response()->json(["code" => "404", "message" => "Data Not Found"], 404);
        }

        return response()->json($result[0], 200);
    }

    public function CategorieSet(Request $request, $idCategorie)
    {
		$body = json_decode($request->getContent());

        $idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];
        
        if (!$this->IsValidID($idCategorie))
            return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		$numberAffected = 0;

		try
		{
			DB::beginTransaction();
			if(isset($body->nom))
			{
				$numberAffected++;
				DB::update('
					UPDATE `categorie`
					SET `nom` =?
                    WHERE `idMaitresseCreatrice` =? AND
                    `idCategorie` =?',
					[$body->nom, $idMaitresse, $idCategorie]);
			}

			if(isset($body->matiere))
			{
				$numberAffected++;
				DB::update('
					UPDATE `categorie`
					SET `matiere` =?
					WHERE `idMaitresseCreatrice` =? AND
                    `idCategorie` =?',
					[$body->matiere, $idMaitresse, $idCategorie]);
			}

			if(isset($body->niveau))
			{
				$numberAffected++;
				DB::update('
					UPDATE `categorie`
					SET `niveau` =?
					WHERE `idMaitresseCreatrice` =? AND
                    `idCategorie` =?',
					[$body->niveau, $idMaitresse, $idCategorie]);
			}

			if(isset($body->estPublic))
			{
				$numberAffected++;
				DB::update('
					UPDATE `categorie`
					SET `estPublic` =?
					WHERE `idMaitresseCreatrice` =? AND
                    `idCategorie` =?',
					[$body->estPublic, $idMaitresse, $idCategorie]);
			}

			DB::commit();
		}
		catch (Exception $e)
		{
			DB::rollBack();
			return response()->json(['code' => 500 ,'message' => 'Could Not Update'], 500);
		}

		return response()->json(['code' => 200 ,'message' => $numberAffected.' Variable(s) Affected'] , 200);
    }

    public function CategorieGetList(Request $request, $page = 1)
    {
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];

		if (!$this->IsValidID($page) && $page != 0)
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		if ($page == 0)
			return response()->json(DB::select('
				SELECT * FROM `categorie`
				WHERE `estPublic` = 1 OR `idMaitresseCreatrice` =?',[$idMaitresseCreatrice]), 200);
				
		return response()->json(DB::select('
			SELECT * FROM `categorie`
			WHERE `estPublic` = 1 OR `idMaitresseCreatrice` =?
			LIMIT ?,30',[$idMaitresseCreatrice, ($page * 30) - 30]), 200);

    }

    public function FicheCreation(Request $request)
    {
        $body = json_decode($request->getContent());
        
        if (!isset($body->idFiche, $body->idCategorie, $body->titre, $body->listeQuestion))
            return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		$idFiche = $body->idFiche;
		$idCategorie = $body->idCategorie;
		$titre = $body->titre;
		$listeQuestion = $body->listeQuestion;

		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];

		if (!isset($idFiche, $idCategorie, $titre, $listeQuestion))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		try
		{
			DB::beginTransaction();

			DB::insert('
				INSERT INTO `fiche`
				(`idFiche`, `idCategorie`, `titre`, `idMaitresseCreatrice`)
				VALUES (?,?,?,?)', [$idFiche, $idCategorie, $titre, $idMaitresseCreatrice]);

			$failed = false;
			$i = 1;
			foreach ($listeQuestion as $question)
			{
				if (!isset($question->question, $question->choixDeReponses, $question->bonneReponse))
				{
					$failed = true;
					break;
				}
				DB::insert('
					INSERT INTO `question`
					(`idQuestion`, `idFiche`, `idCategorie`, `question`, `choixDeReponses`, `bonneReponse`)
					VALUES (?,?,?,?,?,?)',
					[$i, $idFiche, $idCategorie, $question->question, $question->choixDeReponses, $question->bonneReponse]);

				$i++;
			}

			if ($failed)
			{
				DB::rollBack();
				return response()->json(["code" => "400", "message" => "Invalid Parameter in listeQuestion"], 400);
			}
			else
				DB::commit();
		}
		catch (Exception $e)
		{
			DB::rollBack();
			return response()->json(['code' => 500 ,'message' => 'Could Not Create'], 500);
		}

		return response()->json(["code" => "200", "message" => "OK"], 200);
    }

    public function FicheDelete(Request $request, $idCategorie, $idFiche)
    {
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];

		if (!$this->IsValidID($idCategorie) || !$this->IsValidID($idFiche))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		$result = DB::delete('
			DELETE FROM `fiche`
			WHERE `idFiche` =? AND `idCategorie` =? AND `idMaitresseCreatrice` =? ', [$idFiche, $idCategorie, $idMaitresseCreatrice]);

		if ($result == 0)
			return response()->json(["code" => "404", "message" => "Data Not Found"], 404);

		return response()->json(["code" => "200", "message" => "OK"], 200);
    }

    public function FicheGet(Request $request, $idCategorie, $idFiche)
    {
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];

        if (!$this->IsValidID($idCategorie) || !$this->IsValidID($idFiche))
            return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

        $fiche = new Fiche();

        $result = DB::select('
            SELECT * FROM `fiche`
            WHERE `idFiche` =? AND `idCategorie` = ? AND
			(`estPublic` = 1 OR `idMaitresseCreatrice` =?)',
            [$idFiche ,$idCategorie, $idMaitresseCreatrice]);

        if ($result == null)
        {
            return response()->json(["code" => "404", "message" => "Data Not Found"], 404);
        }

        $fiche->idFiche = $result[0]->idFiche;
        $fiche->idCategorie = $result[0]->idCategorie;
        $fiche->titre = $result[0]->titre;
        $fiche->dateCreation = $result[0]->dateCreation;
        $fiche->idMaitresseCreatrice = $result[0]->idMaitresseCreatrice;

        $fiche->listeQuestion = DB::select('
            SELECT *
            FROM `question`
            WHERE `idFiche`=? AND
            `idCategorie`=?', [$idFiche ,$idCategorie]);

        return response()->json($fiche, 200);
    }

	public function FicheSet(Request $request, $idCategorie, $idFiche)
    {
		$body = json_decode($request->getContent());

		$idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];

		$numberAffected = 0;

		try
		{
			DB::beginTransaction();
			if(isset($body->nom))
			{
				$numberAffected++;
				DB::update('
					UPDATE `categorie`
					SET `nom` =?
                    WHERE `idMaitresseCreatrice` =? AND
                    `idCategorie` =? AND
                    `idFiche` =?',
					[$body->nom, $idMaitresse, $idCategorie, $idFiche]);
			}

			if(isset($body->matiere))
			{
				$numberAffected++;
				DB::update('
					UPDATE `categorie`
					SET `matiere` =?
					WHERE `idMaitresseCreatrice` =? AND
                    `idCategorie` =? AND
                    `idFiche` =?',
					[$body->matiere, $idMaitresse, $idCategorie, $idFiche]);
			}

			if(isset($body->niveau))
			{
				$numberAffected++;
				DB::update('
					UPDATE `categorie`
					SET `niveau` =?
					WHERE `idMaitresseCreatrice` =? AND
                    `idCategorie` =? AND
                    `idFiche` =?',
					[$body->niveau, $idMaitresse, $idCategorie, $idFiche]);
			}

			if(isset($body->estPublic))
			{
				$numberAffected++;
				DB::update('
					UPDATE `categorie`
					SET `estPublic` =?
					WHERE `idMaitresseCreatrice` =? AND
                    `idCategorie` =? AND
                    `idFiche` =?',
					[$body->estPublic, $idMaitresse, $idCategorie, $idFiche]);
			}

			if(isset($body->listeQuestion))
			{
                DB::delete('
                    DELETE FROM `question`
                    JOIN `fiche` ON `question`.`idFiche` = `fiche`.`idFiche` AND `question`.`idCategorie` = `fiche`.`idCategorie`
                    WHERE `question`.`idFiche` =? AND `question`.`idCategorie` =? AND `fiche`.`idMaitresseCreatrice` =?', [$idFiche, $idCategorie, $idMaitresse]);

				foreach ($body->listeQuestion as $question)
				{
					if (isset($question->idQuestion, $question->idFiche, $question->idCategorie, $question->question, $question->choixDeReponses, $question->bonneReponse))
					{
						$numberAffected++;
						//DB::update('
						//	UPDATE `question`
						//	SET `quesion` =?,`choixDeReponses` =?,`bonneReponse` =?
						//	WHERE `idQuestion` =?,`idFiche` =?,`idCategorie` =?',
                        //  [$question->question, $question->choixDeReponses, $question->bonneReponse, $question->idQuestion, $question->idFiche, $question->idCategorie]);
                            
                        DB::insert('
                            INSERT INTO `question`
                            (`idQuestion`, `idFiche`, `idCategorie`, `question`, `choixDeReponses`, `bonneReponse`)
                            VALUES (?,?,?,?,?,?)',
                            [$question->idQuestion, $question->idFiche, $question->idCategorie, $question->question, $question->choixDeReponses, $question->bonneReponse]);
                    
					}
				}
			}

			DB::commit();
		}
		catch (Exception $e)
		{
			DB::rollBack();
			return response()->json(['code' => 500 ,'message' => 'Could Not Update'], 500);
		}

		return response()->json(['code' => 200 ,'message' => $numberAffected.' Variable(s) Affected'] , 200);
    }

    public function FicheGetList(Request $request, $page = 1)
    {
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];

		if (!$this->IsValidID($page) && $page != 0)
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		if ($page == 0)
			return response()->json(DB::select('
				SELECT * FROM `fiche`
				WHERE `estPublic` = 1 OR `idMaitresseCreatrice` =?',[$idMaitresseCreatrice]), 200);
		
		return response()->json(DB::select('
			SELECT * FROM `fiche`
			WHERE `estPublic` = 1 OR `idMaitresseCreatrice` =?
			LIMIT ?,30',[$idMaitresseCreatrice, ($page * 30) - 30]), 200);
    }

	public function FicheGetListCategorie(Request $request, $page = 1, $idCategorie)
	{
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];

		if (!$this->IsValidID($page) && $page != 0)
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		if ($page == 0)
			return response()->json(DB::select('
				SELECT * FROM `fiche`
				WHERE `idCategorie` =?` AND (estPublic` = 1 OR `idMaitresseCreatrice` =? )',[$idCategorie, $idMaitresseCreatrice]), 200);

		return response()->json(DB::select('
			SELECT * FROM `fiche`
			WHERE `idCategorie` =?` AND (estPublic` = 1 OR `idMaitresseCreatrice` =? )
			LIMIT ?,30',[$idCategorie, $idMaitresseCreatrice, ($page * 30) - 30]), 200);
	}

    public function UserCreation(Request $request)
    {
        $body = json_decode($request->getContent());
        
        if (!isset($body->prenom, $body->nom))
            return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		$idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];

		DB::insert('
			INSERT INTO `eleve`
			(`prenom`, `nom`)
            VALUES (?,?)', [$body->prenom, $body->nom]);
            
        $idEleveResult = DB::select('SELECT LAST_INSERT_ID() as id');
            
		DB::insert('
            INSERT INTO `classe_eleve_maitresse`
            (`idMaitresse`, `idEleve`) 
            VALUES (?,?)', [$idMaitresse, $idEleveResult[0]->id]);
			
        if(!isset($body->dateNaissance))
            DB::update('
                UPDATE `eleve`
                SET `dateNaissance` =?
                WHERE `idEleve` =?',
                [$body->dateNaissance,$$idEleveResult[0]->id]);

        if(!isset($body->genre))
            DB::update('
                UPDATE `eleve`
                SET `genre` =?
                WHERE `idEleve` =?',
                [$body->genre,$$idEleveResult[0]->id]);

        if(!isset($body->avatar))
            DB::update('
                UPDATE `eleve`
                SET `avatar` =?
                WHERE idEleve` =?',
                [$body->genre,$$idEleveResult[0]->id]);

		return response()->json(["code" => "200", "message" => "OK"], 200);
	}

    public function UserDelete(Request $request, $idEleve)
    {
		$idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];

		if (!$this->IsValidID($idEleve))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		$result = DB::delete('DELETE FROM `classe_eleve_maitresse` WHERE `idMaitresse` =? AND `idEleve` =?', [$idMaitresse, $idEleve]);

		if ($result == 0)
			return response()->json(["code" => "404", "message" => "Data Not Found"], 404);

		return response()->json(["code" => "200", "message" => "OK"], 200);
    }

    public function UserGet(Request $request, $idEleve)
    {
		$idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];

		if (!$this->IsValidID($idEleve))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		$result = DB::select('
			SELECT `eleve`.`idEleve`, `prenom`, `nom`, `dateNaissance`, `genre`, `avatar`
			FROM `eleve`
			JOIN `classe_eleve_maitresse` ON `classe_eleve_maitresse`.`idEleve` = `eleve`.`idEleve`
			WHERE `eleve`.`idEleve` =? AND `classe_eleve_maitresse`.`idMaitresse` =?',[$idEleve, $idMaitresse]);

		if ($result == null)
			return response()->json(["code" => "404", "message" => "Data Not Found"], 404);

		return response()->json($result[0], 200);
    }

    public function UserSet(Request $request, $idEleve)
    {
		$body = json_decode($request->getContent());

        $idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];
        
        if (!$this->IsValidID($idEleve))
            return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

        $elevePersimmsion = DB::select('
			SELECT * FROM `classe_eleve_maitresse`
            WHERE `idEleve` =? AND `idMaitresse` =?',[$idEleve, $idMaitresse]);

        if ($elevePersimmsion == null)
            return response()->json(["code" => "403", "message" => "Invalid Eleve"], 400);
            
		$numberAffected = 0;

		try
		{
			DB::beginTransaction();
			if(isset($body->prenom))
			{
				$numberAffected++;
				DB::update('
					UPDATE `eleve`
					SET `prenom` =?
                    WHERE `idEleve` =?',
					[$body->prenom, $idEleve]);
			}

			if(isset($body->nom))
			{
				$numberAffected++;
				DB::update('
					UPDATE `eleve`
					SET `nom` =?
                    WHERE `idEleve` =?',
					[$body->nom, $idEleve]);
			}

			if(isset($body->qcmMode))
			{
				$numberAffected++;
				DB::update('
					UPDATE `eleve`
					SET `qcmMode` =?
                    WHERE `idEleve` =?',
					[$body->qcmMode, $idEleve]);
			}

			if(isset($body->dateNaissance))
			{
				$numberAffected++;
				DB::update('
					UPDATE `eleve`
					SET `dateNaissance` =?
                    WHERE `idEleve` =?',
					[$body->dateNaissance, $idEleve]);
			}

			if(isset($body->genre))
			{
				$numberAffected++;
				DB::update('
					UPDATE `eleve`
					SET `genre` =?
                    WHERE `idEleve` =?',
					[$body->genre, $idEleve]);
			}

			if(isset($body->avatar))
			{
				$numberAffected++;
				DB::update('
					UPDATE `eleve`
					SET `avatar` =?
                    WHERE `idEleve` =?',
					[$body->avatar, $idEleve]);
			}

            
			DB::commit();
		}
		catch (Exception $e)
		{
			DB::rollBack();
			return response()->json(['code' => 500 ,'message' => 'Could Not Update'], 500);
		}

		return response()->json(['code' => 200 ,'message' => $numberAffected.' Variable(s) Affected'] , 200);
    }

    public function UserGetTODOList(Request $request, $idEleve)
    {
        if (!$this->IsValidID($idEleve))
            return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
            
        $idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];

		return response()->json(DB::select('
            SELECT * FROM `fiche_a_remplir`
			WHERE `idEleve` =? AND
            `idMaitresse` =?',[$idEleve, $idMaitresse]), 200);
    }

    public function UserSetTODOList(Request $request, $idEleve)
    {
        $body = json_decode($request->getContent());

        if (!$this->IsValidID($idEleve) || count($body) == 0)
            return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

        $idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];

        DB::delete('
            DELETE FROM `fiche_a_remplir`
            WHERE `idEleve` =? AND
            `idMaitresse` =?', [$idEleve, $idMaitresse]);
            
        $numberAffected = 0;

        foreach ($body as $item)
        {
            if (isset($item->idCategorie, $item->idFiche))
            {
                $numberAffected++;
                    
                DB::insert('
                    INSERT INTO `fiche_a_remplir`
                    (`idCategorie`, `idFiche`, `idEleve`, `idMaitresse`)
                    VALUES (?,?,?,?)',
                    [$item->idCategorie, $item->idFiche, $idEleve, $idMaitresse]);
            
            }
        }

        return response()->json(['code' => 200 ,'message' => $numberAffected.' Variable(s) Affected'] , 200);
    }

    public function UserGetList(Request $request, $page = 1)
    {
		$idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];

		if (!$this->IsValidID($page) && $page != 0)
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		if ($page == 0)
			return response()->json(DB::select('
				SELECT `eleve`.`idEleve`, `classe_eleve_maitresse`.`idMaitresse`, `prenom`, `nom`, `genre`, `avatar`, `dateNaissance`
				FROM `eleve`
				JOIN `classe_eleve_maitresse` ON `classe_eleve_maitresse`.`idEleve` = `eleve`.`idEleve`
				WHERE `classe_eleve_maitresse`.`idMaitresse` =?',[$idMaitresse]), 200);
			
		return response()->json(DB::select('
			SELECT `eleve`.`idEleve`, `classe_eleve_maitresse`.`idMaitresse`, `prenom`, `nom`, `genre`, `avatar`, `dateNaissance`
			FROM `eleve`
            JOIN `classe_eleve_maitresse` ON `classe_eleve_maitresse`.`idEleve` = `eleve`.`idEleve`
            WHERE `classe_eleve_maitresse`.`idMaitresse` =?
			LIMIT ?,30',[$idMaitresse, ($page * 30) - 30]), 200);
    }

    public function Historique(Request $request, $page = 1)
    {
		$idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];

		if (!$this->IsValidID($page) && $page != 0)
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		if ($page == 0)
			return response()->json(DB::select('
				SELECT * FROM `historique`
				JOIN `classe_eleve_maitresse` ON `classe_eleve_maitresse`.`idEleve` = `historique`.`idEleve`
				WHERE `classe_eleve_maitresse`.`idMaitresse` =?',[$idMaitresse]), 200);
		
		return response()->json(DB::select('
            SELECT * FROM `historique`
            JOIN `classe_eleve_maitresse` ON `classe_eleve_maitresse`.`idEleve` = `historique`.`idEleve`
            WHERE `classe_eleve_maitresse`.`idMaitresse` =?
            LIMIT ?,30',[$idMaitresse, ($page * 30) - 30]), 200);
    }

	private function IsValidID($var)
    {
		if ($var <= 0 || $var > 2147483647 || $var == null)
			return false;

		return true;
    }
}
